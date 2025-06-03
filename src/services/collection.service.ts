import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { extname } from "path";
import {
  COLLECTION_ERROR_DUPLICATE,
  COLLECTION_ERROR_NOT_FOUND,
} from "src/common/constant/collection.constant";
import { PRODUCT_ERROR_NOT_FOUND } from "src/common/constant/product.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
  toCamelCase,
} from "src/common/utils/utils";
import { CreateCollectionDto } from "src/core/dto/collection/collection.create.dto";
import { UpdateCollectionDto } from "src/core/dto/collection/collection.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Collection } from "src/db/entities/Collection";
import { Product } from "src/db/entities/Product";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { Brackets, In, Repository } from "typeorm";
import { File } from "src/db/entities/File";
import { v4 as uuid } from "uuid";
import { UpdateCollectionOrderDto } from "src/core/dto/collection/collection.update-order.dto";
import { Discounts } from "src/db/entities/Discounts";

@Injectable()
export class CollectionService {
  constructor(
    private firebaseProvider: FirebaseProvider,
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>
  ) {}

  async getPagination({ pageSize, pageIndex, order, keywords }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    keywords = keywords ? keywords : "";

    let field = "collection.sequenceId";
    let direction: "ASC" | "DESC" = "ASC";

    if (order) {
      const [rawField, rawDirection] = Object.entries(order)[0];
      field = `collection.${toCamelCase(rawField)}`;
      const upperDir = String(rawDirection).toUpperCase();
      direction = upperDir === "ASC" ? "ASC" : "DESC";
    }

    const [results, total, productCollections] = await Promise.all([
      this.collectionRepo
        .createQueryBuilder("collection")
        .leftJoinAndSelect("collection.thumbnailFile", "thumbnailFile")
        .where(`collection."Active" = true`)
        .andWhere(
          new Brackets((qb) => {
            qb.where(`collection."Name" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            }).orWhere(`collection."Desc" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            });
          })
        )
        .orderBy(field, direction)
        .skip(skip)
        .take(take)
        .getMany(),
      this.collectionRepo
        .createQueryBuilder("collection")
        .where(`collection."Active" = true`)
        .andWhere(
          new Brackets((qb) => {
            qb.where(`collection."Name" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            }).orWhere(`collection."Desc" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            });
          })
        )
        .getCount(),
      this.collectionRepo
        .createQueryBuilder("collection")
        .where(`collection."Active" = true`)
        .andWhere(
          new Brackets((qb) => {
            qb.where(`collection."Name" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            }).orWhere(`collection."Desc" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            });
          })
        )
        .getMany()
        .then(async (res) => {
          const collectionIds = res.map((x) => x.collectionId);
          // return collectionIds;
          return collectionIds.length > 0
            ? await this.collectionRepo.query(`
            SELECT c."CollectionId" as "collectionId",
            COUNT(pc."CollectionId")
            FROM dbo."Collection" c
            LEFT JOIN dbo."ProductCollection" pc ON c."CollectionId" = pc."CollectionId"
            WHERE pc."Active" = true AND c."CollectionId" IN(${collectionIds.join(
              ","
            )})
            GROUP BY c."CollectionId"`)
            : [];
        }),
    ]);
    return {
      results: results.map((x) => {
        x["productCount"] = productCollections.some(
          (pc) => x.collectionId.toString() === pc.collectionId.toString()
        )
          ? productCollections.find(
              (pc) => x.collectionId.toString() === pc.collectionId.toString()
            ).count
          : 0;
        return x;
      }) as any[],
      total,
    };
  }

  async getById(collectionId) {
    const result = await this.collectionRepo.findOne({
      where: {
        collectionId,
        active: true,
      },
      relations: {
        thumbnailFile: true,
        productCollections: {
          product: {
            category: true,
          },
        },
      },
    });
    if (!result) {
      throw Error(COLLECTION_ERROR_NOT_FOUND);
    }
    const productCount = await this.collectionRepo.manager.count(
      ProductCollection,
      {
        where: {
          active: true,
          collection: {
            collectionId,
          },
        },
      }
    );
    return {
      ...result,
      productCount,
      selectedDiscounts: await this.collectionRepo.manager.find(Discounts, {
        where: {
          discountId: In((result.discountTagsIds ?? "0").split(",")),
          active: true,
        },
      }),
    };
  }

  async create(dto: CreateCollectionDto) {
    return await this.collectionRepo.manager.transaction(
      async (entityManager) => {
        try {
          let collection = new Collection();
          collection.name = dto.name;
          collection.desc = dto.desc;
          collection.sequenceId = dto.sequenceId;
          collection.isSale = dto.isSale;
          collection.saleFromDate = dto.saleFromDate;
          collection.saleDueDate = dto.saleDueDate;
          if (dto.isSale) {
            const existingDiscounts = await entityManager.find(Discounts, {
              where: {
                discountId: In(dto.discountTagsIds),
                active: true,
              },
            });

            const foundDiscounts = existingDiscounts.map((p) => p.discountId);
            const missingDiscount = dto.discountTagsIds.filter(
              (id) => !foundDiscounts.includes(id)
            );
            if (missingDiscount.length > 0) {
              throw Error(
                `The following Discounts not found, ${missingDiscount.join(
                  ", "
                )}`
              );
            }

            collection.discountTagsIds = dto.discountTagsIds.join(", ");
          }
          collection = await entityManager.save(Collection, collection);
          if (dto.productIds && dto.productIds.length > 0) {
            const products = await entityManager.find(Product, {
              where: {
                productId: In(dto.productIds),
                active: true,
              },
            });

            if (products.length !== dto.productIds.length) {
              throw Error(PRODUCT_ERROR_NOT_FOUND);
            }

            const productCollections = products.map((product) => {
              const productCollection = new ProductCollection();
              productCollection.product = product;
              productCollection.collection = collection;
              return productCollection;
            });

            // Save ProductCollection entities
            await entityManager.save(ProductCollection, productCollections);
          }

          if (dto.thumbnailFile) {
            const bucket = this.firebaseProvider.app.storage().bucket();
            collection.thumbnailFile = new File();
            const newGUID: string = uuid();
            const bucketFile = bucket.file(
              `collection/${newGUID}${extname(dto.thumbnailFile.fileName)}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              collection.thumbnailFile.guid = newGUID;
              collection.thumbnailFile.fileName = dto.thumbnailFile.fileName;
              collection.thumbnailFile.url = url[0];
              collection.thumbnailFile = await entityManager.save(
                File,
                collection.thumbnailFile
              );
            });
          }
          collection = await entityManager.save(Collection, collection);
          return await entityManager.findOne(Collection, {
            where: {
              collectionId: collection?.collectionId,
            },
            relations: {
              thumbnailFile: true,
            },
          });
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw Error(COLLECTION_ERROR_DUPLICATE);
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async update(collectionId, dto: UpdateCollectionDto) {
    return await this.collectionRepo.manager.transaction(
      async (entityManager) => {
        try {
          let collection = await entityManager.findOne(Collection, {
            where: {
              collectionId,
              active: true,
            },
            relations: {
              thumbnailFile: true,
              productCollections: {
                product: true,
              },
            },
          });
          if (!collection) {
            throw Error(COLLECTION_ERROR_NOT_FOUND);
          }
          collection.name = dto.name;
          collection.desc = dto.desc;
          collection.sequenceId = dto.sequenceId;
          collection.isSale = dto.isSale;
          collection.saleFromDate = dto.saleFromDate;
          collection.saleDueDate = dto.saleDueDate;

          if (dto.isSale) {
            const existingDiscounts = await entityManager.find(Discounts, {
              where: {
                discountId: In(dto.discountTagsIds),
                active: true,
              },
            });

            const foundDiscounts = existingDiscounts.map((p) => p.discountId);
            const missingDiscount = dto.discountTagsIds.filter(
              (id) => !foundDiscounts.includes(id)
            );
            if (missingDiscount.length > 0) {
              throw Error(
                `The following Discounts not found, ${missingDiscount.join(
                  ", "
                )}`
              );
            }

            collection.discountTagsIds = dto.discountTagsIds.join(", ");
          } else {
            collection.discountTagsIds = null;
          }
          if (dto.thumbnailFile) {
            const newGUID: string = uuid();
            const bucket = this.firebaseProvider.app.storage().bucket();
            if (collection.thumbnailFile) {
              try {
                const deleteFile = bucket.file(
                  `collection/${collection.thumbnailFile.guid}${extname(
                    collection.thumbnailFile.fileName
                  )}`
                );
                const exists = await deleteFile.exists();
                if (exists[0]) {
                  deleteFile.delete();
                }
              } catch (ex) {
                console.log(ex);
              }
              const file = collection.thumbnailFile;
              file.guid = newGUID;
              file.fileName = dto.thumbnailFile.fileName;

              const bucketFile = bucket.file(
                `collection/${newGUID}${extname(dto.thumbnailFile.fileName)}`
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
                collection.thumbnailFile = await entityManager.save(File, file);
              });
            } else {
              collection.thumbnailFile = new File();
              collection.thumbnailFile.guid = newGUID;
              collection.thumbnailFile.fileName = dto.thumbnailFile.fileName;
              const bucketFile = bucket.file(
                `collection/${newGUID}${extname(dto.thumbnailFile.fileName)}`
              );
              const img = Buffer.from(dto.thumbnailFile.data, "base64");
              await bucketFile.save(img).then(async () => {
                const url = await bucketFile.getSignedUrl({
                  action: "read",
                  expires: "03-09-2500",
                });
                collection.thumbnailFile.url = url[0];
                collection.thumbnailFile = await entityManager.save(
                  File,
                  collection.thumbnailFile
                );
              });
            }
          }
          collection = await entityManager.save(Collection, collection);
          collection = await entityManager.findOne(Collection, {
            where: {
              collectionId: collection?.collectionId,
            },
            relations: {
              thumbnailFile: true,
              productCollections: {
                product: true,
              },
            },
          });
          // 1. Load existing productIds from productCollections
          const existingProductIds = collection.productCollections.map(
            (pc) => pc.product.productId
          );

          // 2. Determine what to add and what to remove
          const toAdd = dto.productIds.filter(
            (id) => !existingProductIds.includes(id)
          );
          const toRemove = collection.productCollections.filter(
            (pc) => !dto.productIds.includes(pc.product.productId)
          );

          // 3. Delete old relations
          if (toRemove.length > 0) {
            await entityManager.delete(ProductCollection, {
              productCollectionId: In(
                toRemove.map((pc) => pc.productCollectionId)
              ),
            });
          }

          // 4. Create new ProductCollection entries
          if (toAdd.length > 0) {
            const productsToAdd = await entityManager.find(Product, {
              where: { productId: In(toAdd), active: true },
            });

            const newProductCollections = productsToAdd.map((product) => {
              const productCollection = new ProductCollection();
              productCollection.collection = collection;
              productCollection.product = product;
              return productCollection;
            });

            await entityManager.save(ProductCollection, newProductCollections);
          }
          return collection;
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw Error(COLLECTION_ERROR_DUPLICATE);
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async updateOrder(dtos: UpdateCollectionOrderDto[]) {
    return await this.collectionRepo.manager.transaction(
      async (entityManager) => {
        try {
          // Map collections by their IDs to their new sequence values
          const sequenceMap = new Map(
            dtos.map((dto) => [dto.collectionId, dto.sequenceId]) // No need to parse, SequenceId is a string
          );

          // Retrieve all collections involved in the update
          const collections = await entityManager.find(Collection, {
            where: {
              collectionId: In(Array.from(sequenceMap.keys())),
            },
          });

          // Ensure all collections are found
          if (collections.length !== dtos.length) {
            throw new Error(
              "Some collections specified in the request were not found."
            );
          }

          // Temporary sequence to avoid index conflicts
          let tempSequence =
            Math.max(...collections.map((cat) => parseInt(cat.sequenceId))) + 1;

          // Assign temporary sequence IDs
          for (const collection of collections) {
            collection.sequenceId = (tempSequence++).toString();
          }
          await entityManager.save(collections);

          // Assign final sequence IDs
          for (const collection of collections) {
            const newSequence = sequenceMap.get(collection.collectionId);
            if (newSequence !== undefined) {
              collection.sequenceId = newSequence;
            }
          }

          // Save all updates
          await entityManager.save(collections);

          return collections; // Return the updated collections
        } catch (ex) {
          console.error("Error updating order:", ex);
          throw ex;
        }
      }
    );
  }

  async delete(collectionId) {
    return await this.collectionRepo.manager.transaction(
      async (entityManager) => {
        const collection = await entityManager.findOne(Collection, {
          where: {
            collectionId,
            active: true,
          },
        });
        if (!collection) {
          throw Error(COLLECTION_ERROR_NOT_FOUND);
        }
        collection.active = false;
        return await entityManager.save(Collection, collection);
      }
    );
  }
}
