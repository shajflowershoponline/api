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
exports.ProductService = void 0;
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_constant_1 = require("../common/constant/category.constant");
const product_constant_1 = require("../common/constant/product.constant");
const utils_1 = require("../common/utils/utils");
const Category_1 = require("../db/entities/Category");
const Product_1 = require("../db/entities/Product");
const typeorm_2 = require("typeorm");
const File_1 = require("../db/entities/File");
const path_1 = require("path");
const uuid_1 = require("uuid");
const ProductImage_1 = require("../db/entities/ProductImage");
const GiftAddOns_1 = require("../db/entities/GiftAddOns");
const Discounts_1 = require("../db/entities/Discounts");
const Collection_1 = require("../db/entities/Collection");
const ProductCollection_1 = require("../db/entities/ProductCollection");
const CustomerUserWishlist_1 = require("../db/entities/CustomerUserWishlist");
let ProductService = class ProductService {
    constructor(firebaseProvider, productRepo) {
        this.firebaseProvider = firebaseProvider;
        this.productRepo = productRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef, customerUserId, }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const newColDef = [];
        const collectionClDef = [];
        for (const col of columnDef) {
            if (col.name.includes("collection")) {
                collectionClDef.push(col);
            }
            else {
                newColDef.push(col);
            }
        }
        const condition = (0, utils_1.columnDefToTypeORMCondition)(newColDef);
        const collectionCondition = (0, utils_1.columnDefToTypeORMCondition)(collectionClDef);
        const [results, total, productCollection, customerUserWishlist] = await Promise.all([
            this.productRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true, productCollections: collectionCondition }),
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
                where: Object.assign(Object.assign({}, condition), { active: true, productCollections: collectionCondition }),
            }),
            this.productRepo.manager.find(ProductCollection_1.ProductCollection, {
                where: {
                    product: Object.assign(Object.assign({}, condition), { active: true, productCollections: collectionCondition }),
                    active: true,
                },
                relations: {
                    collection: true,
                    product: true,
                },
            }),
            this.productRepo.manager.find(CustomerUserWishlist_1.CustomerUserWishlist, {
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
        ]);
        return {
            results: results.map((p) => {
                p.productCollections = productCollection.filter((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                p["iAmInterested"] = customerUserWishlist.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                p["customerUserWishlist"] = customerUserWishlist.find((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                return p;
            }),
            total,
        };
    }
    async getSearchFilter({ columnDef }) {
        const newColDef = [];
        const collectionClDef = [];
        for (const col of columnDef) {
            if (col.name.includes("collection")) {
                collectionClDef.push(col);
            }
            else {
                newColDef.push(col);
            }
        }
        const condition = (0, utils_1.columnDefToTypeORMCondition)(newColDef);
        const collectionCondition = (0, utils_1.columnDefToTypeORMCondition)(collectionClDef);
        const [results, categories, collections] = await Promise.all([
            this.productRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true, productCollections: collectionCondition }),
                relations: {
                    category: true,
                },
            }),
            this.productRepo.manager.find(Category_1.Category, {
                where: {
                    products: Object.assign(Object.assign({}, condition), { active: true, productCollections: collectionCondition }),
                    active: true,
                },
            }),
            this.productRepo.manager.find(Collection_1.Collection, {
                where: {
                    productCollections: {
                        product: Object.assign(Object.assign({}, condition), { active: true, productCollections: collectionCondition }),
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
            colors: Object.values(results.reduce((acc, curr) => {
                const color = curr.color;
                if (!acc[color]) {
                    acc[color] = { name: color, count: 0 };
                }
                acc[color].count++;
                return acc;
            }, {})),
            categories: categories.map((x) => {
                x["count"] = results.filter((p) => { var _a; return ((_a = p.category) === null || _a === void 0 ? void 0 : _a.categoryId) === x.categoryId; }).length;
                return x;
            }),
            collections: collections.map((x) => {
                x["count"] = results.filter((p) => x.productCollections.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; })).length;
                return x;
            }),
        };
    }
    async getBySku(sku) {
        var _a, _b;
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
            },
        });
        if (!result) {
            throw Error(product_constant_1.PRODUCT_ERROR_NOT_FOUND);
        }
        return Object.assign(Object.assign({}, result), { selectedGiftAddOns: await this.productRepo.manager.find(GiftAddOns_1.GiftAddOns, {
                where: {
                    giftAddOnId: (0, typeorm_2.In)(((_a = result.giftAddOnsAvailable) !== null && _a !== void 0 ? _a : "0").split(",")),
                    active: true,
                },
            }), selectedDiscounts: await this.productRepo.manager.find(Discounts_1.Discounts, {
                where: {
                    discountId: (0, typeorm_2.In)(((_b = result.discountTagsIds) !== null && _b !== void 0 ? _b : "0").split(",")),
                    active: true,
                },
            }) });
    }
    async create(dto) {
        return await this.productRepo.manager.transaction(async (entityManager) => {
            try {
                let product = new Product_1.Product();
                product.name = dto.name;
                product.shortDesc = dto.shortDesc;
                product.longDesc = dto.longDesc;
                product.price = dto.price;
                product.color = dto.color;
                product.size = dto.size.toString();
                const category = await entityManager.findOneBy(Category_1.Category, {
                    categoryId: dto.categoryId,
                });
                if (!category) {
                    throw Error(category_constant_1.CATEGORY_ERROR_NOT_FOUND);
                }
                product.category = category;
                const existingGiftAddOns = await entityManager.find(GiftAddOns_1.GiftAddOns, {
                    where: {
                        giftAddOnId: (0, typeorm_2.In)(dto.giftAddOnsAvailable),
                        active: true,
                    },
                });
                const foundGiftAddOns = existingGiftAddOns.map((p) => p.giftAddOnId);
                const missingGiftAddOns = dto.giftAddOnsAvailable.filter((id) => !foundGiftAddOns.includes(id));
                if (missingGiftAddOns.length > 0) {
                    throw Error(`The following Gift add Ons not found, ${missingGiftAddOns.join(", ")}`);
                }
                product.giftAddOnsAvailable = dto.giftAddOnsAvailable.join(", ");
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
                product.discountTagsIds = dto.discountTagsIds.join(", ");
                const discounts = await entityManager.find(Discounts_1.Discounts, {
                    where: {
                        discountId: (0, typeorm_2.In)(dto.discountTagsIds),
                    },
                });
                if (discounts.length > 0) {
                    const bestDiscount = discounts
                        .map((discount) => {
                        var _a, _b;
                        const discountAmount = discount.type === "PERCENT"
                            ? (Number((_a = discount.value) !== null && _a !== void 0 ? _a : 0) / 100) * Number((_b = dto.price) !== null && _b !== void 0 ? _b : 0)
                            : discount.value;
                        return Object.assign(Object.assign({}, discount), { discountAmount });
                    })
                        .reduce((max, current) => current.discountAmount > max.discountAmount ? current : max);
                    product.discountPrice = bestDiscount.toString();
                }
                else {
                    product.discountPrice = dto.price;
                }
                product = await entityManager.save(Product_1.Product, product);
                product.sku = `P${(0, utils_1.generateIndentityCode)(product.productId)}`;
                product = await entityManager.save(Product_1.Product, product);
                product = await entityManager.findOne(Product_1.Product, {
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
                        let file = new File_1.File();
                        const newGUID = (0, uuid_1.v4)();
                        file.guid = newGUID;
                        file.fileName = item.fileName;
                        const bucketFile = bucket.file(`product/${product.sku}/${newGUID}${(0, path_1.extname)(item.fileName)}`);
                        const img = Buffer.from(item.base64, "base64");
                        await bucketFile.save(img).then(async () => {
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            file.url = url[0];
                            file = await entityManager.save(File_1.File, file);
                            let productImage = new ProductImage_1.ProductImage();
                            productImage.file = file;
                            productImage.product = product;
                            productImage.sequenceId = item.sequenceId;
                            productImage = await entityManager.save(ProductImage_1.ProductImage, productImage);
                        });
                    }
                }
                return product;
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw Error(product_constant_1.PRODUCT_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async update(sku, dto) {
        return await this.productRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c, _d, _e;
            try {
                let product = await entityManager.findOne(Product_1.Product, {
                    where: {
                        sku,
                        active: true,
                    },
                });
                if (!product) {
                    throw Error(product_constant_1.PRODUCT_ERROR_NOT_FOUND);
                }
                product.name = dto.name;
                product.shortDesc = dto.shortDesc;
                product.longDesc = dto.longDesc;
                product.price = dto.price;
                product.color = dto.color;
                product.size = dto.size.toString();
                const category = await entityManager.findOneBy(Category_1.Category, {
                    categoryId: dto.categoryId,
                });
                product.category = category;
                const existingGiftAddOns = await entityManager.find(GiftAddOns_1.GiftAddOns, {
                    where: {
                        giftAddOnId: (0, typeorm_2.In)(dto.giftAddOnsAvailable),
                        active: true,
                    },
                });
                const foundGiftAddOns = existingGiftAddOns.map((p) => p.giftAddOnId);
                const missingGiftAddOns = dto.giftAddOnsAvailable.filter((id) => !foundGiftAddOns.includes(id));
                if (missingGiftAddOns.length > 0) {
                    throw Error(`The following Gift add Ons not found, ${missingGiftAddOns.join(", ")}`);
                }
                product.giftAddOnsAvailable = dto.giftAddOnsAvailable.join(", ");
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
                product.discountTagsIds = dto.discountTagsIds.join(", ");
                const discounts = await entityManager.find(Discounts_1.Discounts, {
                    where: {
                        discountId: (0, typeorm_2.In)(dto.discountTagsIds),
                    },
                });
                if (discounts.length > 0) {
                    const bestDiscount = discounts
                        .map((discount) => {
                        var _a, _b;
                        const discountAmount = discount.type === "PERCENT"
                            ? (Number((_a = discount.value) !== null && _a !== void 0 ? _a : 0) / 100) * Number((_b = dto.price) !== null && _b !== void 0 ? _b : 0)
                            : discount.value;
                        return Object.assign(Object.assign({}, discount), { discountAmount });
                    })
                        .reduce((max, current) => current.discountAmount > max.discountAmount ? current : max);
                    product.discountPrice = (Number((_a = dto.price) !== null && _a !== void 0 ? _a : 0) >= Number(bestDiscount.discountAmount)
                        ? Number((_b = dto.price) !== null && _b !== void 0 ? _b : 0) - Number(bestDiscount.discountAmount)
                        : dto.price).toString();
                }
                else {
                    product.discountPrice = dto.price;
                }
                product = await entityManager.save(Product_1.Product, product);
                product = await entityManager.findOne(Product_1.Product, {
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
                        const deleteOldImages = product.productImages.filter((oldItem) => !dto.productImages
                            .filter((x) => x.noChanges)
                            .some((img) => { var _a; return img.guid === ((_a = oldItem === null || oldItem === void 0 ? void 0 : oldItem.file) === null || _a === void 0 ? void 0 : _a.guid); }));
                        for (const oldItem of deleteOldImages) {
                            try {
                                const productImage = await entityManager.findOne(ProductImage_1.ProductImage, {
                                    where: {
                                        file: { guid: (_c = oldItem === null || oldItem === void 0 ? void 0 : oldItem.file) === null || _c === void 0 ? void 0 : _c.guid },
                                    },
                                    relations: {
                                        file: true,
                                    },
                                });
                                await entityManager.delete(ProductImage_1.ProductImage, productImage);
                                await entityManager.delete(File_1.File, productImage.file);
                                const deleteFile = bucket.file(`product/${product.sku}/${(_d = oldItem === null || oldItem === void 0 ? void 0 : oldItem.file) === null || _d === void 0 ? void 0 : _d.guid}${(0, path_1.extname)((_e = oldItem === null || oldItem === void 0 ? void 0 : oldItem.file) === null || _e === void 0 ? void 0 : _e.fileName)}`);
                                const exists = await deleteFile.exists();
                                if (exists[0]) {
                                    deleteFile.delete();
                                }
                            }
                            catch (ex) {
                                console.log(ex);
                            }
                        }
                    }
                    if (dto.productImages &&
                        dto.productImages.filter((x) => !x.noChanges).length > 0) {
                        const newProductImages = dto.productImages.filter((x) => !x.noChanges);
                        const productImages = [];
                        for (const item of newProductImages) {
                            let file = new File_1.File();
                            const newGUID = (0, uuid_1.v4)();
                            file.guid = newGUID;
                            file.fileName = item.fileName;
                            const bucketFile = bucket.file(`product/${product.sku}/${newGUID}${(0, path_1.extname)(item.fileName)}`);
                            const img = Buffer.from(item.base64, "base64");
                            await bucketFile.save(img).then(async () => {
                                const url = await bucketFile.getSignedUrl({
                                    action: "read",
                                    expires: "03-09-2500",
                                });
                                file.url = url[0];
                                file = await entityManager.save(File_1.File, file);
                                let productImage = new ProductImage_1.ProductImage();
                                productImage.file = file;
                                productImage.product = product;
                                productImage.sequenceId = item.sequenceId;
                                productImage = await entityManager.save(ProductImage_1.ProductImage, productImage);
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
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw Error(product_constant_1.PRODUCT_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async batchUpdateDiscountPrice(skuIds) {
        return await this.productRepo.manager.transaction(async (entityManager) => {
            var _a, _b;
            try {
                const products = await entityManager.find(Product_1.Product, {
                    where: {
                        sku: (0, typeorm_2.In)(skuIds.split(", ")),
                        active: true,
                    },
                });
                for (let product of products) {
                    const discounts = await entityManager.find(Discounts_1.Discounts, {
                        where: {
                            discountId: (0, typeorm_2.In)(product.discountTagsIds.split(",")),
                        },
                    });
                    if (discounts) {
                        const bestDiscount = discounts
                            .map((discount) => {
                            var _a, _b;
                            const discountAmount = discount.type === "PERCENT"
                                ? (Number((_a = discount.value) !== null && _a !== void 0 ? _a : 0) / 100) *
                                    Number((_b = product.price) !== null && _b !== void 0 ? _b : 0)
                                : discount.value;
                            return Object.assign(Object.assign({}, discount), { discountAmount });
                        })
                            .reduce((max, current) => current.discountAmount > max.discountAmount ? current : max);
                        product.discountPrice = (Number((_a = product.price) !== null && _a !== void 0 ? _a : 0) >= Number(bestDiscount.discountAmount)
                            ? Number((_b = product.price) !== null && _b !== void 0 ? _b : 0) -
                                Number(bestDiscount.discountAmount)
                            : product.price).toString();
                    }
                    else {
                        product.discountPrice = product.price;
                    }
                    product = await entityManager.save(Product_1.Product, product);
                }
                return await entityManager.find(Product_1.Product, {
                    where: {
                        sku: (0, typeorm_2.In)(skuIds.split(", ")),
                        active: true,
                    },
                });
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw Error(product_constant_1.PRODUCT_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async delete(sku) {
        return await this.productRepo.manager.transaction(async (entityManager) => {
            const product = await entityManager.findOne(Product_1.Product, {
                where: {
                    sku,
                    active: true,
                },
            });
            if (!product) {
                throw Error(product_constant_1.PRODUCT_ERROR_NOT_FOUND);
            }
            product.active = false;
            return await entityManager.save(Product_1.Product, product);
        });
    }
};
ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Product_1.Product)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map