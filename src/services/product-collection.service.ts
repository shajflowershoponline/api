import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  COLLECTION_ERROR_NOT_FOUND,
  PRODUCT_COLLECTION_ERROR_NOT_FOUND,
} from "src/common/constant/collection.constant";
import { PRODUCT_ERROR_NOT_FOUND } from "src/common/constant/product.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateProductCollectionDto } from "src/core/dto/product-collection/product-collection.create.dto";
import { Collection } from "src/db/entities/Collection";
import { Product } from "src/db/entities/Product";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { Repository } from "typeorm";

@Injectable()
export class ProductCollectionService {
  constructor(
    @InjectRepository(ProductCollection)
    private readonly collectionRepo: Repository<ProductCollection>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.collectionRepo.find({
        where: {
          ...condition,
          active: true,
        },
        relations: {
          collection: true,
          product: {
            category: true,
          }
        },
        skip,
        take,
        order,
      }),
      this.collectionRepo.count({
        where: {
          ...condition,
          active: true,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getById(productCollectionId) {
    const result = await this.collectionRepo.findOne({
      where: {
        productCollectionId,
        active: true,
      },
      relations: {
        product: {
          thumbnailFile: true,
        },
        collection: {
          thumbnailFile: true,
        },
      },
    });
    if (!result) {
      throw Error(PRODUCT_COLLECTION_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateProductCollectionDto) {
    return await this.collectionRepo.manager.transaction(
      async (entityManager) => {
        const collection = await entityManager.findOne(Collection, {
          where: {
            collectionId: dto.collectionId,
            active: true,
          },
        });
        if (!collection) {
          throw Error(COLLECTION_ERROR_NOT_FOUND);
        }
        const product = await entityManager.findOne(Product, {
          where: {
            sku: dto.sku,
            active: true,
          },
        });
        if (!product) {
          throw Error(PRODUCT_ERROR_NOT_FOUND);
        }
        let productCollection = await entityManager.findOne(ProductCollection, {
          where: {
            collection: {
              collectionId: dto.collectionId,
            },
            product: {
              sku: dto.sku,
            },
            active: true,
          },
        });
        if (productCollection) {
          throw Error("The product has already been added to the collection!");
        }
        productCollection = new ProductCollection();
        productCollection.collection = collection;
        productCollection.product = product;
        productCollection = await entityManager.save(
          ProductCollection,
          productCollection
        );
        return productCollection;
      }
    );
  }

  async delete(productCollectionId) {
    return await this.collectionRepo.manager.transaction(
      async (entityManager) => {
        const productCollection = await entityManager.findOne(
          ProductCollection,
          {
            where: {
              productCollectionId,
              active: true,
            },
          }
        );
        if (!productCollection) {
          throw Error(PRODUCT_COLLECTION_ERROR_NOT_FOUND);
        }
        productCollection.active = false;
        return await entityManager.save(ProductCollection, productCollection);
      }
    );
  }
}
