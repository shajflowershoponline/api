import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { extname } from "path";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
  toCamelCase,
} from "src/common/utils/utils";
import { CreateDiscountDto } from "src/core/dto/discounts/discounts.create.dto";
import { UpdateDiscountDto } from "src/core/dto/discounts/discounts.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Discounts } from "src/db/entities/Discounts";
import { Product } from "src/db/entities/Product";
import { Brackets, In, Repository } from "typeorm";
import { File } from "src/db/entities/File";
import { v4 as uuid } from "uuid";
import {
  DISCOUNT_ERROR_NOT_FOUND,
  DISCOUNT_ERROR_DUPLICATE,
} from "src/common/constant/discounts.constant";

@Injectable()
export class DiscountsService {
  constructor(
    private firebaseProvider: FirebaseProvider,
    @InjectRepository(Discounts)
    private readonly discountRepo: Repository<Discounts>
  ) {}

  async getPagination({ pageSize, pageIndex, order, keywords }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    let field = "discount.discountId";
    let direction: "ASC" | "DESC" = "ASC";

    if (order) {
      const [rawField, rawDirection] = Object.entries(order)[0];
      field = `discount.${toCamelCase(rawField)}`;
      const upperDir = String(rawDirection).toUpperCase();
      direction = upperDir === "ASC" ? "ASC" : "DESC";
    }

    const [results, total] = await Promise.all([
      this.discountRepo
        .createQueryBuilder("discount")
        .leftJoinAndSelect("discount.thumbnailFile", "thumbnailFile")
        .where(`discount."Active" = true`)
        .andWhere(
          new Brackets((qb) => {
            qb.where(`discount."PromoCode" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            })
              .orWhere(`discount."Description" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`discount."Type" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`CAST(discount."Value" AS TEXT) ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              });
          })
        )
        .orderBy(field, direction)
        .skip(skip)
        .take(take)
        .getMany(),
      this.discountRepo
        .createQueryBuilder("discount")
        .where(`discount."Active" = true`)
        .andWhere(
          new Brackets((qb) => {
            qb.where(`discount."PromoCode" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            })
              .orWhere(`discount."Description" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`discount."Type" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`CAST(discount."Value" AS TEXT) ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              });
          })
        )
        .getCount(),
    ]);

    return {
      results,
      total,
    };
  }

  async getById(discountId) {
    const result = await this.discountRepo.findOne({
      where: {
        discountId,
        active: true,
      },
      relations: {
        thumbnailFile: true,
      },
    });
    if (!result) {
      throw Error(DISCOUNT_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateDiscountDto) {
    return await this.discountRepo.manager.transaction(
      async (entityManager) => {
        try {
          let discount = new Discounts();
          discount.promoCode = dto.promoCode;
          discount.description = dto.description;
          discount.type = dto.type;
          discount.value = dto.value;
          discount = await entityManager.save(Discounts, discount);

          if (dto.thumbnailFile) {
            const bucket = this.firebaseProvider.app.storage().bucket();
            discount.thumbnailFile = new File();
            const newGUID: string = uuid();
            const bucketFile = bucket.file(
              `discounts/${newGUID}${extname(dto.thumbnailFile.fileName)}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              discount.thumbnailFile.guid = newGUID;
              discount.thumbnailFile.fileName = dto.thumbnailFile.fileName;
              discount.thumbnailFile.url = url[0];
              discount.thumbnailFile = await entityManager.save(
                File,
                discount.thumbnailFile
              );
            });
          }

          discount = await entityManager.save(Discounts, discount);
          return await entityManager.findOne(Discounts, {
            where: {
              discountId: discount?.discountId,
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
            throw Error(DISCOUNT_ERROR_DUPLICATE);
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async update(discountId, dto: UpdateDiscountDto) {
    return await this.discountRepo.manager.transaction(
      async (entityManager) => {
        try {
          let discount = await entityManager.findOne(Discounts, {
            where: {
              discountId,
              active: true,
            },
            relations: {
              thumbnailFile: true,
            },
          });
          if (!discount) {
            throw Error(DISCOUNT_ERROR_NOT_FOUND);
          }
          discount.promoCode = dto.promoCode;
          discount.description = dto.description;
          discount.type = dto.type;
          discount.value = dto.value;
          if (dto.thumbnailFile) {
            const newGUID: string = uuid();
            const bucket = this.firebaseProvider.app.storage().bucket();
            if (discount.thumbnailFile) {
              try {
                const deleteFile = bucket.file(
                  `discounts/${discount.thumbnailFile.guid}${extname(
                    discount.thumbnailFile.fileName
                  )}`
                );
                const exists = await deleteFile.exists();
                if (exists[0]) {
                  deleteFile.delete();
                }
              } catch (ex) {
                console.log(ex);
              }
              const file = discount.thumbnailFile;
              file.guid = newGUID;
              file.fileName = dto.thumbnailFile.fileName;

              const bucketFile = bucket.file(
                `discounts/${newGUID}${extname(dto.thumbnailFile.fileName)}`
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
                discount.thumbnailFile = await entityManager.save(File, file);
              });
            } else {
              discount.thumbnailFile = new File();
              discount.thumbnailFile.guid = newGUID;
              discount.thumbnailFile.fileName = dto.thumbnailFile.fileName;
              const bucketFile = bucket.file(
                `discounts/${newGUID}${extname(dto.thumbnailFile.fileName)}`
              );
              const img = Buffer.from(dto.thumbnailFile.data, "base64");
              await bucketFile.save(img).then(async () => {
                const url = await bucketFile.getSignedUrl({
                  action: "read",
                  expires: "03-09-2500",
                });
                discount.thumbnailFile.url = url[0];
                discount.thumbnailFile = await entityManager.save(
                  File,
                  discount.thumbnailFile
                );
              });
            }
          }
          discount = await entityManager.save(Discounts, discount);
          return await entityManager.findOne(Discounts, {
            where: {
              discountId: discount?.discountId,
            },
            relations: {
              thumbnailFile: true,
            },
          });
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw Error(DISCOUNT_ERROR_DUPLICATE);
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async delete(discountId) {
    return await this.discountRepo.manager.transaction(
      async (entityManager) => {
        const discount = await entityManager.findOne(Discounts, {
          where: {
            discountId,
            active: true,
          },
        });
        if (!discount) {
          throw Error(DISCOUNT_ERROR_NOT_FOUND);
        }
        discount.active = false;
        return await entityManager.save(Discounts, discount);
      }
    );
  }
}
