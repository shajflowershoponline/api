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
exports.CollectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const collection_constant_1 = require("../common/constant/collection.constant");
const product_constant_1 = require("../common/constant/product.constant");
const utils_1 = require("../common/utils/utils");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const Collection_1 = require("../db/entities/Collection");
const Product_1 = require("../db/entities/Product");
const ProductCollection_1 = require("../db/entities/ProductCollection");
const typeorm_2 = require("typeorm");
const File_1 = require("../db/entities/File");
const uuid_1 = require("uuid");
const Discounts_1 = require("../db/entities/Discounts");
let CollectionService = class CollectionService {
    constructor(firebaseProvider, collectionRepo) {
        this.firebaseProvider = firebaseProvider;
        this.collectionRepo = collectionRepo;
    }
    async getPagination({ pageSize, pageIndex, order, keywords }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        keywords = keywords ? keywords : "";
        let field = "collection.sequenceId";
        let direction = "ASC";
        if (order) {
            const [rawField, rawDirection] = Object.entries(order)[0];
            field = `collection.${(0, utils_1.toCamelCase)(rawField)}`;
            const upperDir = String(rawDirection).toUpperCase();
            direction = upperDir === "ASC" ? "ASC" : "DESC";
        }
        const [results, total, productCollections] = await Promise.all([
            this.collectionRepo
                .createQueryBuilder("collection")
                .leftJoinAndSelect("collection.thumbnailFile", "thumbnailFile")
                .where(`collection."Active" = true`)
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`collection."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                }).orWhere(`collection."Desc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .orderBy(field, direction)
                .skip(skip)
                .take(take)
                .getMany(),
            this.collectionRepo
                .createQueryBuilder("collection")
                .where(`collection."Active" = true`)
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`collection."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                }).orWhere(`collection."Desc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .getCount(),
            this.collectionRepo
                .createQueryBuilder("collection")
                .where(`collection."Active" = true`)
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`collection."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                }).orWhere(`collection."Desc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .getMany()
                .then(async (res) => {
                const collectionIds = res.map((x) => x.collectionId);
                return collectionIds.length > 0
                    ? await this.collectionRepo.query(`
            SELECT c."CollectionId" as "collectionId",
            COUNT(pc."CollectionId")
            FROM dbo."Collection" c
            LEFT JOIN dbo."ProductCollection" pc ON c."CollectionId" = pc."CollectionId"
            WHERE pc."Active" = true AND c."CollectionId" IN(${collectionIds.join(",")})
            GROUP BY c."CollectionId"`)
                    : [];
            }),
        ]);
        return {
            results: results.map((x) => {
                x["productCount"] = productCollections.some((pc) => x.collectionId.toString() === pc.collectionId.toString())
                    ? productCollections.find((pc) => x.collectionId.toString() === pc.collectionId.toString()).count
                    : 0;
                return x;
            }),
            total,
        };
    }
    async getById(collectionId) {
        var _a;
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
            throw Error(collection_constant_1.COLLECTION_ERROR_NOT_FOUND);
        }
        const productCount = await this.collectionRepo.manager.count(ProductCollection_1.ProductCollection, {
            where: {
                active: true,
                collection: {
                    collectionId,
                },
            },
        });
        return Object.assign(Object.assign({}, result), { productCount, selectedDiscounts: await this.collectionRepo.manager.find(Discounts_1.Discounts, {
                where: {
                    discountId: (0, typeorm_2.In)(((_a = result.discountTagsIds) !== null && _a !== void 0 ? _a : "0").split(",")),
                    active: true,
                },
            }) });
    }
    async create(dto) {
        return await this.collectionRepo.manager.transaction(async (entityManager) => {
            try {
                let collection = new Collection_1.Collection();
                collection.name = dto.name;
                collection.desc = dto.desc;
                collection.sequenceId = dto.sequenceId;
                collection.isSale = dto.isSale;
                collection.saleFromDate = dto.saleFromDate;
                collection.saleDueDate = dto.saleDueDate;
                collection.isFeatured = dto.isFeatured;
                if (dto.isSale) {
                    const existingDiscounts = await entityManager.find(Discounts_1.Discounts, {
                        where: {
                            discountId: (0, typeorm_2.In)(dto.discountTagsIds),
                            active: true,
                        },
                    });
                    const foundDiscounts = existingDiscounts.map((p) => p.discountId);
                    const missingDiscount = dto.discountTagsIds.filter((id) => !foundDiscounts.includes(id));
                    if (missingDiscount.length > 0) {
                        throw Error(`The following Discounts not found, ${missingDiscount.join(", ")}`);
                    }
                    collection.discountTagsIds = dto.discountTagsIds.join(", ");
                }
                collection = await entityManager.save(Collection_1.Collection, collection);
                if (dto.productIds && dto.productIds.length > 0) {
                    const products = await entityManager.find(Product_1.Product, {
                        where: {
                            productId: (0, typeorm_2.In)(dto.productIds),
                            active: true,
                        },
                    });
                    if (products.length !== dto.productIds.length) {
                        throw Error(product_constant_1.PRODUCT_ERROR_NOT_FOUND);
                    }
                    const productCollections = products.map((product) => {
                        const productCollection = new ProductCollection_1.ProductCollection();
                        productCollection.product = product;
                        productCollection.collection = collection;
                        return productCollection;
                    });
                    await entityManager.save(ProductCollection_1.ProductCollection, productCollections);
                }
                if (dto.thumbnailFile) {
                    const bucket = this.firebaseProvider.app.storage().bucket();
                    collection.thumbnailFile = new File_1.File();
                    const newGUID = (0, uuid_1.v4)();
                    const bucketFile = bucket.file(`collection/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                    const img = Buffer.from(dto.thumbnailFile.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        collection.thumbnailFile.guid = newGUID;
                        collection.thumbnailFile.fileName = dto.thumbnailFile.fileName;
                        collection.thumbnailFile.url = url[0];
                        collection.thumbnailFile = await entityManager.save(File_1.File, collection.thumbnailFile);
                    });
                }
                collection = await entityManager.save(Collection_1.Collection, collection);
                return await entityManager.findOne(Collection_1.Collection, {
                    where: {
                        collectionId: collection === null || collection === void 0 ? void 0 : collection.collectionId,
                    },
                    relations: {
                        thumbnailFile: true,
                    },
                });
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw Error(collection_constant_1.COLLECTION_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async update(collectionId, dto) {
        return await this.collectionRepo.manager.transaction(async (entityManager) => {
            try {
                let collection = await entityManager.findOne(Collection_1.Collection, {
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
                    throw Error(collection_constant_1.COLLECTION_ERROR_NOT_FOUND);
                }
                collection.name = dto.name;
                collection.desc = dto.desc;
                collection.sequenceId = dto.sequenceId;
                collection.isSale = dto.isSale;
                collection.saleFromDate = dto.saleFromDate;
                collection.saleDueDate = dto.saleDueDate;
                collection.isFeatured = dto.isFeatured;
                if (dto.isSale) {
                    const existingDiscounts = await entityManager.find(Discounts_1.Discounts, {
                        where: {
                            discountId: (0, typeorm_2.In)(dto.discountTagsIds),
                            active: true,
                        },
                    });
                    const foundDiscounts = existingDiscounts.map((p) => p.discountId);
                    const missingDiscount = dto.discountTagsIds.filter((id) => !foundDiscounts.includes(id));
                    if (missingDiscount.length > 0) {
                        throw Error(`The following Discounts not found, ${missingDiscount.join(", ")}`);
                    }
                    collection.discountTagsIds = dto.discountTagsIds.join(", ");
                }
                else {
                    collection.discountTagsIds = null;
                }
                if (dto.thumbnailFile) {
                    const newGUID = (0, uuid_1.v4)();
                    const bucket = this.firebaseProvider.app.storage().bucket();
                    if (collection.thumbnailFile) {
                        try {
                            const deleteFile = bucket.file(`collection/${collection.thumbnailFile.guid}${(0, path_1.extname)(collection.thumbnailFile.fileName)}`);
                            const exists = await deleteFile.exists();
                            if (exists[0]) {
                                deleteFile.delete();
                            }
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                        const file = collection.thumbnailFile;
                        file.guid = newGUID;
                        file.fileName = dto.thumbnailFile.fileName;
                        const bucketFile = bucket.file(`collection/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async (res) => {
                            console.log("res");
                            console.log(res);
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            file.url = url[0];
                            collection.thumbnailFile = await entityManager.save(File_1.File, file);
                        });
                    }
                    else {
                        collection.thumbnailFile = new File_1.File();
                        collection.thumbnailFile.guid = newGUID;
                        collection.thumbnailFile.fileName = dto.thumbnailFile.fileName;
                        const bucketFile = bucket.file(`collection/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async () => {
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            collection.thumbnailFile.url = url[0];
                            collection.thumbnailFile = await entityManager.save(File_1.File, collection.thumbnailFile);
                        });
                    }
                }
                collection = await entityManager.save(Collection_1.Collection, collection);
                collection = await entityManager.findOne(Collection_1.Collection, {
                    where: {
                        collectionId: collection === null || collection === void 0 ? void 0 : collection.collectionId,
                    },
                    relations: {
                        thumbnailFile: true,
                        productCollections: {
                            product: true,
                        },
                    },
                });
                const existingProductIds = collection.productCollections.map((pc) => pc.product.productId);
                const toAdd = dto.productIds.filter((id) => !existingProductIds.includes(id));
                const toRemove = collection.productCollections.filter((pc) => !dto.productIds.includes(pc.product.productId));
                if (toRemove.length > 0) {
                    await entityManager.delete(ProductCollection_1.ProductCollection, {
                        productCollectionId: (0, typeorm_2.In)(toRemove.map((pc) => pc.productCollectionId)),
                    });
                }
                if (toAdd.length > 0) {
                    const productsToAdd = await entityManager.find(Product_1.Product, {
                        where: { productId: (0, typeorm_2.In)(toAdd), active: true },
                    });
                    const newProductCollections = productsToAdd.map((product) => {
                        const productCollection = new ProductCollection_1.ProductCollection();
                        productCollection.collection = collection;
                        productCollection.product = product;
                        return productCollection;
                    });
                    await entityManager.save(ProductCollection_1.ProductCollection, newProductCollections);
                }
                return collection;
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw Error(collection_constant_1.COLLECTION_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async updateOrder(dtos) {
        return await this.collectionRepo.manager.transaction(async (entityManager) => {
            try {
                const sequenceMap = new Map(dtos.map((dto) => [dto.collectionId, dto.sequenceId]));
                const collections = await entityManager.find(Collection_1.Collection, {
                    where: {
                        collectionId: (0, typeorm_2.In)(Array.from(sequenceMap.keys())),
                    },
                });
                if (collections.length !== dtos.length) {
                    throw new Error("Some collections specified in the request were not found.");
                }
                let tempSequence = Math.max(...collections.map((cat) => parseInt(cat.sequenceId))) + 1;
                for (const collection of collections) {
                    collection.sequenceId = (tempSequence++).toString();
                }
                await entityManager.save(collections);
                for (const collection of collections) {
                    const newSequence = sequenceMap.get(collection.collectionId);
                    if (newSequence !== undefined) {
                        collection.sequenceId = newSequence;
                    }
                }
                await entityManager.save(collections);
                return collections;
            }
            catch (ex) {
                console.error("Error updating order:", ex);
                throw ex;
            }
        });
    }
    async delete(collectionId) {
        return await this.collectionRepo.manager.transaction(async (entityManager) => {
            const collection = await entityManager.findOne(Collection_1.Collection, {
                where: {
                    collectionId,
                    active: true,
                },
            });
            if (!collection) {
                throw Error(collection_constant_1.COLLECTION_ERROR_NOT_FOUND);
            }
            collection.active = false;
            return await entityManager.save(Collection_1.Collection, collection);
        });
    }
    async updateFeatured(collectionId, isFeatured) {
        return await this.collectionRepo.manager.transaction(async (entityManager) => {
            const collection = await entityManager.findOne(Collection_1.Collection, {
                where: {
                    collectionId,
                    active: true,
                },
            });
            if (!collection) {
                throw Error(collection_constant_1.COLLECTION_ERROR_NOT_FOUND);
            }
            collection.isFeatured = isFeatured;
            return await entityManager.save(Collection_1.Collection, collection);
        });
    }
};
CollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Collection_1.Collection)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], CollectionService);
exports.CollectionService = CollectionService;
//# sourceMappingURL=collection.service.js.map