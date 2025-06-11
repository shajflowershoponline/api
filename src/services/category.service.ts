import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { extname } from "path";
import {
  CATEGORY_ERROR_DUPLICATE,
  CATEGORY_ERROR_NOT_FOUND,
} from "src/common/constant/category.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
  toCamelCase,
} from "src/common/utils/utils";
import { CreateCategoryDto } from "src/core/dto/category/category.create.dto";
import { UpdateCategoryOrderDto } from "src/core/dto/category/category.update-order.dto";
import { UpdateCategoryDto } from "src/core/dto/category/category.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Category } from "src/db/entities/Category";
import { Product } from "src/db/entities/Product";
import { Brackets, In, Repository } from "typeorm";
import { File } from "src/db/entities/File";
import { v4 as uuid } from "uuid";

@Injectable()
export class CategoryService {
  constructor(
    private firebaseProvider: FirebaseProvider,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>
  ) {}

  async advancedSearchCategoryIds(query: string): Promise<string[]> {
    if (!query) return [];

    const keywords = query
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((kw) => kw.toLowerCase());

    if (keywords.length === 0) return [];

    const conditions: string[] = [];

    for (const keyword of keywords) {
      conditions.push(`LOWER(c."Name") LIKE '%${keyword}%' 
      OR LOWER(c."Desc") LIKE '%${keyword}%'`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE (${conditions.join(" OR ")})` : "";

    const sql = `
    SELECT DISTINCT c."CategoryId"
    FROM dbo."Category" c
    ${whereClause}
  `;

    const rows = await this.categoryRepo.query(sql);
    return rows.map((row) => row.CategoryId);
  }

  async getPagination({ pageSize, pageIndex, order, keywords }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    keywords = keywords ? keywords : "";

    let field = "category.sequenceId";
    let direction: "ASC" | "DESC" = "ASC";

    if (order) {
      const [rawField, rawDirection] = Object.entries(order)[0];
      field = `category.${toCamelCase(rawField)}`;
      const upperDir = String(rawDirection).toUpperCase();
      direction = upperDir === "ASC" ? "ASC" : "DESC";
    }

    const [results, total, categories] = await Promise.all([
      this.categoryRepo
        .createQueryBuilder("category")
        .leftJoinAndSelect("category.thumbnailFile", "thumbnailFile")
        .where(`category."Active" = true`)
        .andWhere(
          new Brackets((qb) => {
            qb.where(`category."Name" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            }).orWhere(`category."Desc" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            });
          })
        )
        .orderBy(field, direction)
        .skip(skip)
        .take(take)
        .getMany(),
      this.categoryRepo
        .createQueryBuilder("category")
        .where(`category."Active" = true`)
        .andWhere(
          new Brackets((qb) => {
            qb.where(`category."Name" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            }).orWhere(`category."Desc" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            });
          })
        )
        .getCount(),
      this.categoryRepo
        .createQueryBuilder("category")
        .where(`category."Active" = true`)
        .andWhere(
          new Brackets((qb) => {
            qb.where(`category."Name" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            }).orWhere(`category."Desc" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            });
          })
        )
        .getMany()
        .then(async (res) => {
          const categoryIds = res.map((x) => x.categoryId);
          // return collectionIds;
          const queryRes =
            categoryIds.length > 0
              ? await this.categoryRepo.query(`
            SELECT c."CategoryId" as "categoryId",
            COUNT(p."ProductId")
            FROM dbo."Category" c
            LEFT JOIN dbo."Product" p ON c."CategoryId" = p."CategoryId"
            WHERE p."Active" = true AND c."CategoryId" IN(${categoryIds.join(
              ","
            )})
            GROUP BY c."CategoryId"`)
              : [];
          return queryRes as { categoryId: string; count: number }[];
        }),
    ]);

    return {
      results: results.map((x) => {
        x["productCount"] = categories.some(
          (pc) => x.categoryId.toString() === pc.categoryId.toString()
        )
          ? categories.find(
              (pc) => x.categoryId.toString() === pc.categoryId.toString()
            ).count
          : 0;
        return x;
      }) as any[],
      total,
    };
  }

  async getById(categoryId) {
    const result = await this.categoryRepo.findOne({
      where: {
        categoryId,
        active: true,
      },
      relations: {
        thumbnailFile: true,
      },
    });
    if (!result) {
      throw Error(CATEGORY_ERROR_NOT_FOUND);
    }
    const productCount = await this.categoryRepo.manager.count(Product, {
      where: {
        category: {
          categoryId,
        },
      },
    });
    return {
      ...result,
      productCount,
    };
  }

  async create(dto: CreateCategoryDto) {
    return await this.categoryRepo.manager.transaction(
      async (entityManager) => {
        try {
          let category = new Category();
          category.name = dto.name;
          category.desc = dto.desc;
          category.sequenceId = dto.sequenceId;
          category = await entityManager.save(Category, category);

          if (dto.thumbnailFile) {
            const bucket = this.firebaseProvider.app.storage().bucket();
            category.thumbnailFile = new File();
            const newGUID: string = uuid();
            const bucketFile = bucket.file(
              `category/${newGUID}${extname(dto.thumbnailFile.fileName)}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              category.thumbnailFile.guid = newGUID;
              category.thumbnailFile.fileName = dto.thumbnailFile.fileName;
              category.thumbnailFile.url = url[0];
              category.thumbnailFile = await entityManager.save(
                File,
                category.thumbnailFile
              );
            });
          }

          category = await entityManager.save(Category, category);
          return await entityManager.findOne(Category, {
            where: {
              categoryId: category?.categoryId,
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
            throw Error(CATEGORY_ERROR_DUPLICATE);
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async update(categoryId, dto: UpdateCategoryDto) {
    return await this.categoryRepo.manager.transaction(
      async (entityManager) => {
        try {
          let category = await entityManager.findOne(Category, {
            where: {
              categoryId,
              active: true,
            },
            relations: {
              thumbnailFile: true,
            },
          });
          if (!category) {
            throw Error(CATEGORY_ERROR_NOT_FOUND);
          }
          category.name = dto.name;
          category.desc = dto.desc;
          category.sequenceId = dto.sequenceId;
          if (dto.thumbnailFile) {
            const newGUID: string = uuid();
            const bucket = this.firebaseProvider.app.storage().bucket();
            if (category.thumbnailFile) {
              try {
                const deleteFile = bucket.file(
                  `category/${category.thumbnailFile.guid}${extname(
                    category.thumbnailFile.fileName
                  )}`
                );
                const exists = await deleteFile.exists();
                if (exists[0]) {
                  deleteFile.delete();
                }
              } catch (ex) {
                console.log(ex);
              }
              const file = category.thumbnailFile;
              file.guid = newGUID;
              file.fileName = dto.thumbnailFile.fileName;

              const bucketFile = bucket.file(
                `category/${newGUID}${extname(dto.thumbnailFile.fileName)}`
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
                category.thumbnailFile = await entityManager.save(File, file);
              });
            } else {
              category.thumbnailFile = new File();
              category.thumbnailFile.guid = newGUID;
              category.thumbnailFile.fileName = dto.thumbnailFile.fileName;
              const bucketFile = bucket.file(
                `category/${newGUID}${extname(dto.thumbnailFile.fileName)}`
              );
              const img = Buffer.from(dto.thumbnailFile.data, "base64");
              await bucketFile.save(img).then(async () => {
                const url = await bucketFile.getSignedUrl({
                  action: "read",
                  expires: "03-09-2500",
                });
                category.thumbnailFile.url = url[0];
                category.thumbnailFile = await entityManager.save(
                  File,
                  category.thumbnailFile
                );
              });
            }
          }
          category = await entityManager.save(Category, category);
          return await entityManager.findOne(Category, {
            where: {
              categoryId: category?.categoryId,
            },
            relations: {
              thumbnailFile: true,
            },
          });
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw Error(CATEGORY_ERROR_DUPLICATE);
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async updateOrder(dtos: UpdateCategoryOrderDto[]) {
    return await this.categoryRepo.manager.transaction(
      async (entityManager) => {
        try {
          // Map categories by their IDs to their new sequence values
          const sequenceMap = new Map(
            dtos.map((dto) => [dto.categoryId, dto.sequenceId]) // No need to parse, SequenceId is a string
          );

          // Retrieve all categories involved in the update
          const categories = await entityManager.find(Category, {
            where: {
              categoryId: In(Array.from(sequenceMap.keys())),
            },
          });

          // Ensure all categories are found
          if (categories.length !== dtos.length) {
            throw new Error(
              "Some categories specified in the request were not found."
            );
          }

          // Temporary sequence to avoid index conflicts
          let tempSequence =
            Math.max(...categories.map((cat) => parseInt(cat.sequenceId))) + 1;

          // Assign temporary sequence IDs
          for (const category of categories) {
            category.sequenceId = (tempSequence++).toString();
          }
          await entityManager.save(categories);

          // Assign final sequence IDs
          for (const category of categories) {
            const newSequence = sequenceMap.get(category.categoryId);
            if (newSequence !== undefined) {
              category.sequenceId = newSequence;
            }
          }

          // Save all updates
          await entityManager.save(categories);

          return categories; // Return the updated categories
        } catch (ex) {
          console.error("Error updating order:", ex);
          throw ex;
        }
      }
    );
  }

  async delete(categoryId) {
    return await this.categoryRepo.manager.transaction(
      async (entityManager) => {
        const category = await entityManager.findOne(Category, {
          where: {
            categoryId,
            active: true,
          },
        });
        if (!category) {
          throw Error(CATEGORY_ERROR_NOT_FOUND);
        }
        category.active = false;
        return await entityManager.save(Category, category);
      }
    );
  }
}
