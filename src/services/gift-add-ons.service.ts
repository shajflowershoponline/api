import { Order } from "./../db/entities/Order";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { extname } from "path";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
  toCamelCase,
  toPascalCase,
} from "src/common/utils/utils";
import { CreateGiftAddOnDto } from "src/core/dto/gift-add-ons/gift-add-ons.create.dto";
import { UpdateGiftAddOnDto } from "src/core/dto/gift-add-ons/gift-add-ons.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { GiftAddOns } from "src/db/entities/GiftAddOns";
import { Product } from "src/db/entities/Product";
import {
  Brackets,
  DataSource,
  In,
  OrderByCondition,
  Raw,
  Repository,
} from "typeorm";
import { File } from "src/db/entities/File";
import { v4 as uuid } from "uuid";
import {
  GIFTADDON_ERROR_DUPLICATE,
  GIFTADDON_ERROR_NOT_FOUND,
} from "src/common/constant/gift-add-ons.constant";

@Injectable()
export class GiftAddOnsService {
  constructor(
    private firebaseProvider: FirebaseProvider,
    @InjectRepository(GiftAddOns)
    private readonly giftAddOnRepo: Repository<GiftAddOns>
  ) {}

  async getPagination({ pageSize, pageIndex, order, keywords }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    keywords = keywords ? keywords : "";

    let field = "gift.giftAddOnId";
    let direction: "ASC" | "DESC" = "ASC";

    if (order) {
      const [rawField, rawDirection] = Object.entries(order)[0];
      field = `gift.${toCamelCase(rawField)}`;
      const upperDir = String(rawDirection).toUpperCase();
      direction = upperDir === "ASC" ? "ASC" : "DESC";
    }

    const query = this.giftAddOnRepo
      .createQueryBuilder("gift")
      .leftJoinAndSelect("gift.thumbnailFile", "thumbnailFile")
      .where(`gift."Active" = true`)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`gift."Name" ILIKE :keywords`, {
            keywords: `%${keywords}%`,
          }).orWhere(`gift."Description" ILIKE :keywords`, {
            keywords: `%${keywords}%`,
          });
        })
      )
      .orderBy(field, direction);

    const queryResults = take > 0 ? query.skip(skip).take(take) : query;

    const [results, total] = await Promise.all([
      queryResults.getMany(),
      query.getCount(),
    ]);

    return {
      results,
      total,
    };
  }

  async getById(giftAddOnId) {
    const result = await this.giftAddOnRepo.findOne({
      where: {
        giftAddOnId,
        active: true,
      },
      relations: {
        thumbnailFile: true,
      },
    });
    if (!result) {
      throw Error(GIFTADDON_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateGiftAddOnDto) {
    return await this.giftAddOnRepo.manager.transaction(
      async (entityManager) => {
        try {
          let giftAddOn = new GiftAddOns();
          giftAddOn.name = dto.name;
          giftAddOn.description = dto.description;
          giftAddOn = await entityManager.save(GiftAddOns, giftAddOn);

          if (dto.thumbnailFile) {
            const bucket = this.firebaseProvider.app.storage().bucket();
            giftAddOn.thumbnailFile = new File();
            const newGUID: string = uuid();
            const bucketFile = bucket.file(
              `gift-add-ons/${newGUID}${extname(dto.thumbnailFile.fileName)}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              giftAddOn.thumbnailFile.guid = newGUID;
              giftAddOn.thumbnailFile.fileName = dto.thumbnailFile.fileName;
              giftAddOn.thumbnailFile.url = url[0];
              giftAddOn.thumbnailFile = await entityManager.save(
                File,
                giftAddOn.thumbnailFile
              );
            });
          }

          giftAddOn = await entityManager.save(GiftAddOns, giftAddOn);
          return await entityManager.findOne(GiftAddOns, {
            where: {
              giftAddOnId: giftAddOn?.giftAddOnId,
            },
            relations: {
              thumbnailFile: true,
            },
          });
        } catch (ex) {
          if (
            ex.message.toLowerCase().includes("duplicate") &&
            ex.message.toLowerCase().includes("sequenceid")
          ) {
            throw Error("Sequence already exist");
          } else if (
            ex.message.toLowerCase().includes("duplicate") &&
            ex.message.toLowerCase().includes("name")
          ) {
            throw Error(GIFTADDON_ERROR_DUPLICATE);
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async update(giftAddOnId, dto: UpdateGiftAddOnDto) {
    return await this.giftAddOnRepo.manager.transaction(
      async (entityManager) => {
        try {
          let giftAddOn = await entityManager.findOne(GiftAddOns, {
            where: {
              giftAddOnId,
              active: true,
            },
            relations: {
              thumbnailFile: true,
            },
          });
          if (!giftAddOn) {
            throw Error(GIFTADDON_ERROR_NOT_FOUND);
          }
          giftAddOn.name = dto.name;
          giftAddOn.description = dto.description;
          if (dto.thumbnailFile) {
            const newGUID: string = uuid();
            const bucket = this.firebaseProvider.app.storage().bucket();
            if (giftAddOn.thumbnailFile) {
              try {
                const deleteFile = bucket.file(
                  `gift-add-ons/${giftAddOn.thumbnailFile.guid}${extname(
                    giftAddOn.thumbnailFile.fileName
                  )}`
                );
                const exists = await deleteFile.exists();
                if (exists[0]) {
                  deleteFile.delete();
                }
              } catch (ex) {
                console.log(ex);
              }
              const file = giftAddOn.thumbnailFile;
              file.guid = newGUID;
              file.fileName = dto.thumbnailFile.fileName;

              const bucketFile = bucket.file(
                `gift-add-ons/${newGUID}${extname(dto.thumbnailFile.fileName)}`
              );
              const img = Buffer.from(dto.thumbnailFile.data, "base64");
              await bucketFile.save(img).then(async (res) => {
                console.log("res");
                console.log(res);
                const url = await bucketFile.getSignedUrl({
                  action: "read",
                  expires: "03-09-2500",
                });

                file.url = url[0];
                giftAddOn.thumbnailFile = await entityManager.save(File, file);
              });
            } else {
              giftAddOn.thumbnailFile = new File();
              giftAddOn.thumbnailFile.guid = newGUID;
              giftAddOn.thumbnailFile.fileName = dto.thumbnailFile.fileName;
              const bucketFile = bucket.file(
                `gift-add-ons/${newGUID}${extname(dto.thumbnailFile.fileName)}`
              );
              const img = Buffer.from(dto.thumbnailFile.data, "base64");
              await bucketFile.save(img).then(async () => {
                const url = await bucketFile.getSignedUrl({
                  action: "read",
                  expires: "03-09-2500",
                });
                giftAddOn.thumbnailFile.url = url[0];
                giftAddOn.thumbnailFile = await entityManager.save(
                  File,
                  giftAddOn.thumbnailFile
                );
              });
            }
          }
          giftAddOn = await entityManager.save(GiftAddOns, giftAddOn);
          return await entityManager.findOne(GiftAddOns, {
            where: {
              giftAddOnId: giftAddOn?.giftAddOnId,
            },
            relations: {
              thumbnailFile: true,
            },
          });
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw Error(GIFTADDON_ERROR_DUPLICATE);
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async delete(giftAddOnId) {
    return await this.giftAddOnRepo.manager.transaction(
      async (entityManager) => {
        const giftAddOn = await entityManager.findOne(GiftAddOns, {
          where: {
            giftAddOnId,
            active: true,
          },
        });
        if (!giftAddOn) {
          throw Error(GIFTADDON_ERROR_NOT_FOUND);
        }
        giftAddOn.active = false;
        return await entityManager.save(GiftAddOns, giftAddOn);
      }
    );
  }
}
