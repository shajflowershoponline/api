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
exports.CustomerUserWishListService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_user_error_constant_1 = require("../common/constant/customer-user-error.constant");
const discounts_constant_copy_1 = require("../common/constant/discounts.constant copy");
const product_constant_1 = require("../common/constant/product.constant");
const utils_1 = require("../common/utils/utils");
const CustomerUser_1 = require("../db/entities/CustomerUser");
const CustomerUserWishlist_1 = require("../db/entities/CustomerUserWishlist");
const Product_1 = require("../db/entities/Product");
const typeorm_2 = require("typeorm");
let CustomerUserWishListService = class CustomerUserWishListService {
    constructor(customerUserWishlistRepo) {
        this.customerUserWishlistRepo = customerUserWishlistRepo;
    }
    async getPagination({ customerUserId, pageSize, pageIndex, order, keywords, }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        let field = "customerUserWishlist.dateTime";
        let direction = "ASC";
        if (order) {
            const [rawField, rawDirection] = Object.entries(order)[0];
            field = `customerUserWishlist.${(0, utils_1.toCamelCase)(rawField)}`;
            const upperDir = String(rawDirection).toUpperCase();
            direction = upperDir === "ASC" ? "ASC" : "DESC";
        }
        const [results, total] = await Promise.all([
            this.customerUserWishlistRepo
                .createQueryBuilder("customerUserWishlist")
                .leftJoinAndSelect("customerUserWishlist.customerUser", "customerUser")
                .leftJoinAndSelect("customerUserWishlist.product", "product")
                .leftJoinAndSelect("product.category", "category")
                .leftJoinAndSelect("product.productImages", "productImages")
                .leftJoinAndSelect("productImages.file", "file")
                .where('"customerUser"."CustomerUserId" = :customerUserId', {
                customerUserId,
            })
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`product."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`product."ShortDesc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`product."LongDesc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`category."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`category."Desc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .orderBy(field, direction)
                .skip(skip)
                .take(take)
                .getMany(),
            this.customerUserWishlistRepo
                .createQueryBuilder("customerUserWishlist")
                .leftJoinAndSelect("customerUserWishlist.customerUser", "customerUser")
                .leftJoin("customerUserWishlist.product", "product")
                .leftJoin("product.category", "category")
                .where('"customerUser"."CustomerUserId" = :customerUserId', {
                customerUserId,
            })
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`product."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`product."ShortDesc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`product."LongDesc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`category."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`category."Desc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .getCount(),
        ]);
        return { results, total };
    }
    async getById(customerUserWishlistId) {
        const result = await this.customerUserWishlistRepo.findOne({
            where: {
                customerUserWishlistId,
            },
            relations: {
                customerUser: true,
                product: {
                    thumbnailFile: true,
                    category: true,
                },
            },
        });
        if (!result) {
            throw Error(discounts_constant_copy_1.CUSTOMERUSERWISHLIST_ERROR_NOT_FOUND);
        }
        return result;
    }
    async getBySKU(customerUserId, sku) {
        const result = await this.customerUserWishlistRepo.findOne({
            where: {
                product: {
                    sku,
                },
                customerUser: {
                    customerUserId,
                },
            },
            relations: {
                product: {
                    category: true,
                },
            },
        });
        if (!result) {
            throw Error(discounts_constant_copy_1.CUSTOMERUSERWISHLIST_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.customerUserWishlistRepo.manager.transaction(async (entityManager) => {
            var _a;
            try {
                let customerUserWishlist = new CustomerUserWishlist_1.CustomerUserWishlist();
                customerUserWishlist.dateTime = await (0, utils_1.getDate)();
                const customer = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                    where: {
                        customerUserId: dto.customerUserId,
                    },
                });
                if (!customer) {
                    throw Error(customer_user_error_constant_1.CUSTOMER_USER_ERROR_USER_NOT_FOUND);
                }
                customerUserWishlist.customerUser = customer;
                const product = await entityManager.findOne(Product_1.Product, {
                    where: {
                        productId: dto.productId,
                    },
                });
                if (!product) {
                    throw Error(product_constant_1.PRODUCT_ERROR_NOT_FOUND);
                }
                customerUserWishlist.product = product;
                customerUserWishlist = await entityManager.save(CustomerUserWishlist_1.CustomerUserWishlist, customerUserWishlist);
                const interested = Number((_a = product.interested) !== null && _a !== void 0 ? _a : 0) + 1;
                product.interested = interested.toString();
                await entityManager.save(Product_1.Product, product);
                return await entityManager.findOne(CustomerUserWishlist_1.CustomerUserWishlist, {
                    where: {
                        customerUserWishlistId: customerUserWishlist === null || customerUserWishlist === void 0 ? void 0 : customerUserWishlist.customerUserWishlistId,
                    },
                    relations: {
                        customerUser: true,
                        product: {
                            thumbnailFile: true,
                            category: true,
                        },
                    },
                });
            }
            catch (ex) {
                if (ex.message && ex.message.includes("duplicate")) {
                    throw Error(discounts_constant_copy_1.CUSTOMERUSERWISHLIST_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async delete(customerUserWishlistId) {
        var _a;
        const customerUserWishlist = await this.customerUserWishlistRepo.findOne({
            where: {
                customerUserWishlistId,
            },
            relations: {
                customerUser: true,
                product: {
                    category: true,
                },
            },
        });
        if (!customerUserWishlist) {
            throw Error(discounts_constant_copy_1.CUSTOMERUSERWISHLIST_ERROR_NOT_FOUND);
        }
        await this.customerUserWishlistRepo.delete(customerUserWishlistId);
        const interested = Number((_a = customerUserWishlist.product.interested) !== null && _a !== void 0 ? _a : 0) - 1;
        customerUserWishlist.product.interested = (interested <= 0 ? 0 : interested).toString();
        await this.customerUserWishlistRepo.manager.save(Product_1.Product, customerUserWishlist.product);
        return customerUserWishlist;
    }
};
CustomerUserWishListService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(CustomerUserWishlist_1.CustomerUserWishlist)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerUserWishListService);
exports.CustomerUserWishListService = CustomerUserWishListService;
//# sourceMappingURL=customer-user-wish-list.service.js.map