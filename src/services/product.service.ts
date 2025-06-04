import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CATEGORY_ERROR_NOT_FOUND } from "src/common/constant/category.constant";
import {
  PRODUCT_ERROR_DUPLICATE,
  PRODUCT_ERROR_NOT_FOUND,
} from "src/common/constant/product.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
  toCamelCase,
} from "src/common/utils/utils";
import { CreateProductDto } from "src/core/dto/product/product.create.dto";
import { UpdateProductDto } from "src/core/dto/product/product.update.dto";
import { Category } from "src/db/entities/Category";
import { Product } from "src/db/entities/Product";
import { Brackets, In, Repository } from "typeorm";
import { File } from "src/db/entities/File";
import { extname } from "path";
import { v4 as uuid } from "uuid";
import { ProductImage } from "src/db/entities/ProductImage";
import { GiftAddOns } from "src/db/entities/GiftAddOns";
import { Discounts } from "src/db/entities/Discounts";
import { Collection } from "src/db/entities/Collection";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { CustomerUserWishlist } from "src/db/entities/CustomerUserWishlist";

@Injectable()
export class ProductService {
  constructor(
    private firebaseProvider: FirebaseProvider,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  async getClientPagination({
    pageSize,
    pageIndex,
    order,
    columnDef,
    customerUserId,
  }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const newColDef = [];
    const collectionClDef = [];
    for (const col of columnDef) {
      if (col.name.includes("collection")) {
        collectionClDef.push(col);
      } else {
        newColDef.push(col);
      }
    }
    const condition = columnDefToTypeORMCondition(newColDef);
    const collectionCondition = columnDefToTypeORMCondition(collectionClDef);
    const [results, total, customerUserWishlist, discounts] = await Promise.all(
      [
        this.productRepo.find({
          where: {
            ...condition,
            active: true,
            productCollections: collectionCondition,
          },
          relations: {
            productImages: {
              file: true,
            },
            category: {
              thumbnailFile: true,
            },
            productCollections: {
              collection: true,
            },
          },
          skip,
          take,
          order,
        }),
        this.productRepo.count({
          where: {
            ...condition,
            active: true,
            productCollections: collectionCondition,
          },
        }),
        this.productRepo.manager.find(CustomerUserWishlist, {
          where: {
            customerUser: {
              customerUserId,
            },
          },
          relations: {
            customerUser: true,
            product: true,
          },
        }),
        this.productRepo.manager.find(Discounts, {
          where: {
            active: true,
          },
        }),
      ]
    );
    return {
      results: results.map((p) => {
        const maxDiscount =
          (p.discountTagsIds ?? "") !== ""
            ? Math.max(
                ...discounts
                  .filter((d) =>
                    p.discountTagsIds.split(",").includes(d.discountId)
                  )
                  .map((d) =>
                    d.type === "PERCENT"
                      ? (parseFloat(d.value) / 100) * Number(p.price ?? 0)
                      : parseFloat(d.value)
                  )
              )
            : 0;
        p["discountPrice"] = (Number(p.price ?? 0) - maxDiscount).toString();
        p["isSale"] =
          p.productCollections.some(
            (x) => x.product?.productId === p.productId && x.collection.isSale
          ) || (p.discountTagsIds ?? "").split(", ").length > 0;
        p["iAmInterested"] = customerUserWishlist.some(
          (x) => x.product?.productId === p.productId
        );
        p["customerUserWishlist"] = customerUserWishlist.find(
          (x) => x.product?.productId === p.productId
        );
        return p;
      }),
      total,
    };
  }

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const newColDef = [];
    const collectionClDef = [];
    for (const col of columnDef) {
      if (col?.name?.includes("collection")) {
        collectionClDef.push(col);
      } else {
        newColDef.push(col);
      }
    }
    const condition = columnDefToTypeORMCondition(newColDef);
    const collectionCondition = columnDefToTypeORMCondition(collectionClDef);
    const [results, total] = await Promise.all([
      this.productRepo.find({
        where: {
          ...condition,
          active: true,
          productCollections: collectionCondition,
        },
        relations: {
          productImages: {
            file: true,
          },
          category: {
            thumbnailFile: true,
          },
          productCollections: true,
        },
        skip,
        take,
        order,
      }),
      this.productRepo.count({
        where: {
          ...condition,
          active: true,
          productCollections: collectionCondition,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getSearchFilter({ columnDef }) {
    const newColDef = [];
    const collectionClDef = [];
    for (const col of columnDef) {
      if (col.name.includes("collection")) {
        collectionClDef.push(col);
      } else {
        newColDef.push(col);
      }
    }
    const condition = columnDefToTypeORMCondition(newColDef);
    const collectionCondition = columnDefToTypeORMCondition(collectionClDef);

    const [results, categories, collections] = await Promise.all([
      this.productRepo.find({
        where: {
          ...condition,
          active: true,
          productCollections: collectionCondition,
        },
        relations: {
          category: true,
        },
      }),
      this.productRepo.manager.find(Category, {
        where: {
          products: {
            ...condition,
            active: true,
            productCollections: collectionCondition,
          },
          active: true,
        },
      }),
      this.productRepo.manager.find(Collection, {
        where: {
          productCollections: {
            product: {
              ...condition,
              active: true,
              productCollections: collectionCondition,
            },
          },
          active: true,
        },
        relations: {
          productCollections: {
            product: true,
          },
        },
      }),
    ]);
    return {
      colors: Object.values(
        results.reduce((acc, curr) => {
          const color = curr.color;
          if (!acc[color]) {
            acc[color] = { name: color, count: 0 };
          }
          acc[color].count++;
          return acc;
        }, {} as Record<string, { name: string; count: number }>)
      ),
      categories: categories.map((x) => {
        x["count"] = results.filter(
          (p) => p.category?.categoryId === x.categoryId
        ).length;
        return x;
      }),
      collections: collections.map((x) => {
        x["count"] = results.filter((p) =>
          x.productCollections.some((x) => x.product?.productId === p.productId)
        ).length;
        return x;
      }),
    };
  }

  async getBySku(sku) {
    const result = await this.productRepo.findOne({
      where: {
        sku,
        active: true,
      },
      relations: {
        productImages: {
          file: true,
        },
        category: {
          thumbnailFile: true,
        },
        productCollections: {
          collection: true,
        },
      },
    });
    if (!result) {
      throw Error(PRODUCT_ERROR_NOT_FOUND);
    }
    const selectedDiscounts = await this.productRepo.manager.find(Discounts, {
      where: {
        discountId: In(
          (result.discountTagsIds ?? "0").split(",").map((x) => Number(x))
        ),
        active: true,
      },
    });
    const maxDiscount = Math.max(
      ...selectedDiscounts
        .filter(
          (d) => result.discountTagsIds ?? "0".split(",").includes(d.discountId)
        )
        .map((d) =>
          d.type === "PERCENT"
            ? (parseFloat(d.value) / 100) * Number(result.price ?? 0)
            : parseFloat(d.value)
        )
    );
    result["discountPrice"] = (
      Number(result.price ?? 0) - maxDiscount
    ).toString();
    return {
      ...result,
      selectedGiftAddOns: await this.productRepo.manager.find(GiftAddOns, {
        where: {
          giftAddOnId: In(
            (result.giftAddOnsAvailable ?? "0").split(",").map((x) => Number(x))
          ),
          active: true,
        },
      }),
      selectedDiscounts,
    };
  }

  async create(dto: CreateProductDto) {
    return await this.productRepo.manager.transaction(async (entityManager) => {
      try {
        let product = new Product();
        product.name = dto.name;
        product.shortDesc = dto.shortDesc;
        product.longDesc = dto.longDesc;
        product.price = dto.price;
        product.color = dto.color;
        product.size = dto.size.toString();
        const category = await entityManager.findOneBy(Category, {
          categoryId: dto.categoryId,
        });
        if (!category) {
          throw Error(CATEGORY_ERROR_NOT_FOUND);
        }
        product.category = category;
        const existingGiftAddOns = await entityManager.find(GiftAddOns, {
          where: {
            giftAddOnId: In(dto.giftAddOnsAvailable),
            active: true,
          },
        });

        const foundGiftAddOns = existingGiftAddOns.map((p) => p.giftAddOnId);
        const missingGiftAddOns = dto.giftAddOnsAvailable.filter(
          (id) => !foundGiftAddOns.includes(id)
        );
        if (missingGiftAddOns.length > 0) {
          throw Error(
            `The following Gift add Ons not found, ${missingGiftAddOns.join(
              ", "
            )}`
          );
        }
        product.giftAddOnsAvailable = dto.giftAddOnsAvailable.join(", ");

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
            `The following Discounts not found, ${missingDiscount.join(", ")}`
          );
        }

        product.discountTagsIds = dto.discountTagsIds.join(", ");
        product = await entityManager.save(Product, product);
        product.sku = `P${generateIndentityCode(product.productId)}`;
        product = await entityManager.save(Product, product);

        product = await entityManager.findOne(Product, {
          where: {
            productId: product.productId,
          },
          relations: {
            category: {
              thumbnailFile: true,
            },
          },
        });
        const bucket = this.firebaseProvider.app.storage().bucket();
        if (dto.productImages && dto.productImages.length > 0) {
          for (const item of dto.productImages) {
            let file = new File();
            const newGUID: string = uuid();
            file.guid = newGUID;
            file.fileName = item.fileName;
            const bucketFile = bucket.file(
              `product/${product.sku}/${newGUID}${extname(item.fileName)}`
            );
            const img = Buffer.from(item.base64, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              file.url = url[0];
              file = await entityManager.save(File, file);
              let productImage = new ProductImage();
              productImage.file = file;
              productImage.product = product;
              productImage.sequenceId = item.sequenceId;
              productImage = await entityManager.save(
                ProductImage,
                productImage
              );
            });
          }
        }
        return product;
      } catch (ex) {
        if (ex.message.includes("duplicate")) {
          throw Error(PRODUCT_ERROR_DUPLICATE);
        } else {
          throw ex;
        }
      }
    });
  }

  async update(sku, dto: UpdateProductDto) {
    return await this.productRepo.manager.transaction(async (entityManager) => {
      try {
        let product = await entityManager.findOne(Product, {
          where: {
            sku,
            active: true,
          },
        });
        if (!product) {
          throw Error(PRODUCT_ERROR_NOT_FOUND);
        }
        product.name = dto.name;
        product.shortDesc = dto.shortDesc;
        product.longDesc = dto.longDesc;
        product.price = dto.price;
        product.color = dto.color;
        product.size = dto.size.toString();
        const category = await entityManager.findOneBy(Category, {
          categoryId: dto.categoryId,
        });
        product.category = category;
        const existingGiftAddOns = await entityManager.find(GiftAddOns, {
          where: {
            giftAddOnId: In(dto.giftAddOnsAvailable),
            active: true,
          },
        });

        const foundGiftAddOns = existingGiftAddOns.map((p) => p.giftAddOnId);
        const missingGiftAddOns = dto.giftAddOnsAvailable.filter(
          (id) => !foundGiftAddOns.includes(id)
        );
        if (missingGiftAddOns.length > 0) {
          throw Error(
            `The following Gift add Ons not found, ${missingGiftAddOns.join(
              ", "
            )}`
          );
        }
        product.giftAddOnsAvailable = dto.giftAddOnsAvailable.join(", ");

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
            `The following Discounts not found, ${missingDiscount.join(", ")}`
          );
        }

        product.discountTagsIds = dto.discountTagsIds.join(", ");
        product = await entityManager.save(Product, product);
        product = await entityManager.findOne(Product, {
          where: {
            productId: product.productId,
          },
          relations: {
            productImages: {
              file: true,
            },
            category: {
              thumbnailFile: true,
            },
          },
        });

        if (dto.updateImage) {
          const bucket = this.firebaseProvider.app.storage().bucket();
          if (product.productImages && product.productImages.length > 0) {
            const deleteOldImages = product.productImages.filter(
              (oldItem) =>
                !dto.productImages
                  .filter((x) => x.noChanges)
                  .some((img) => img.guid === oldItem?.file?.guid)
            );
            for (const oldItem of deleteOldImages) {
              try {
                const productImage = await entityManager.findOne(ProductImage, {
                  where: {
                    file: { guid: oldItem?.file?.guid },
                  },
                  relations: {
                    file: true,
                  },
                });
                await entityManager.delete(ProductImage, productImage);
                await entityManager.delete(File, productImage.file);
                const deleteFile = bucket.file(
                  `product/${product.sku}/${oldItem?.file?.guid}${extname(
                    oldItem?.file?.fileName
                  )}`
                );
                const exists = await deleteFile.exists();
                if (exists[0]) {
                  deleteFile.delete();
                }
              } catch (ex) {
                console.log(ex);
              }
            }
          }
          if (
            dto.productImages &&
            dto.productImages.filter((x) => !x.noChanges).length > 0
          ) {
            const newProductImages = dto.productImages.filter(
              (x) => !x.noChanges
            );
            const productImages = [];
            for (const item of newProductImages) {
              let file = new File();
              const newGUID: string = uuid();
              file.guid = newGUID;
              file.fileName = item.fileName;
              const bucketFile = bucket.file(
                `product/${product.sku}/${newGUID}${extname(item.fileName)}`
              );
              const img = Buffer.from(item.base64, "base64");
              await bucketFile.save(img).then(async () => {
                const url = await bucketFile.getSignedUrl({
                  action: "read",
                  expires: "03-09-2500",
                });
                file.url = url[0];
                file = await entityManager.save(File, file);
                let productImage = new ProductImage();
                productImage.file = file;
                productImage.product = product;
                productImage.sequenceId = item.sequenceId;
                productImage = await entityManager.save(
                  ProductImage,
                  productImage
                );

                productImages.push({
                  url: url[0],
                  guid: newGUID,
                  fileName: item.fileName,
                });
              });
            }
            product.productImages = productImages;
          }
        }
        return product;
      } catch (ex) {
        if (ex.message.includes("duplicate")) {
          throw Error(PRODUCT_ERROR_DUPLICATE);
        } else {
          throw ex;
        }
      }
    });
  }

  async delete(sku) {
    return await this.productRepo.manager.transaction(async (entityManager) => {
      const product = await entityManager.findOne(Product, {
        where: {
          sku,
          active: true,
        },
      });
      if (!product) {
        throw Error(PRODUCT_ERROR_NOT_FOUND);
      }
      product.active = false;
      return await entityManager.save(Product, product);
    });
  }
}
