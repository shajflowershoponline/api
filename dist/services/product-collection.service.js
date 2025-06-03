"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCollectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const collection_constant_1 = require("../common/constant/collection.constant");
const product_constant_1 = require("../common/constant/product.constant");
const utils_1 = require("../common/utils/utils");
const Collection_1 = require("../db/entities/Collection");
const Product_1 = require("../db/entities/Product");
const ProductCollection_1 = require("../db/entities/ProductCollection");
const typeorm_2 = require("typeorm");
let ProductCollectionService = class ProductCollectionService {
    constructor(collectionRepo) {
        this.collectionRepo = collectionRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.collectionRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
            throw Error(collection_constant_1.PRODUCT_COLLECTION_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.collectionRepo.manager.transaction(async (entityManager) => {
            const collection = await entityManager.findOne(Collection_1.Collection, {
                where: {
                    collectionId: dto.collectionId,
                    active: true,
                },
            });
            if (!collection) {
                throw Error(collection_constant_1.COLLECTION_ERROR_NOT_FOUND);
            }
            const product = await entityManager.findOne(Product_1.Product, {
                where: {
                    sku: dto.sku,
                    active: true,
                },
            });
            if (!product) {
                throw Error(product_constant_1.PRODUCT_ERROR_NOT_FOUND);
            }
            let productCollection = await entityManager.findOne(ProductCollection_1.ProductCollection, {
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
            productCollection = new ProductCollection_1.ProductCollection();
            productCollection.collection = collection;
            productCollection.product = product;
            productCollection = await entityManager.save(ProductCollection_1.ProductCollection, productCollection);
            return productCollection;
        });
    }
    async delete(productCollectionId) {
        return await this.collectionRepo.manager.transaction(async (entityManager) => {
            const productCollection = await entityManager.findOne(ProductCollection_1.ProductCollection, {
                where: {
                    productCollectionId,
                    active: true,
                },
            });
            if (!productCollection) {
                throw Error(collection_constant_1.PRODUCT_COLLECTION_ERROR_NOT_FOUND);
            }
            productCollection.active = false;
            return await entityManager.save(ProductCollection_1.ProductCollection, productCollection);
        });
    }
};
ProductCollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ProductCollection_1.ProductCollection)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductCollectionService);
exports.ProductCollectionService = ProductCollectionService;
//# sourceMappingURL=product-collection.service.js.map