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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cart_error_constant_1 = require("../common/constant/cart-error.constant");
const customer_user_error_constant_1 = require("../common/constant/customer-user-error.constant");
const utils_1 = require("../common/utils/utils");
const CartItems_1 = require("../db/entities/CartItems");
const Collection_1 = require("../db/entities/Collection");
const CustomerCoupon_1 = require("../db/entities/CustomerCoupon");
const CustomerUser_1 = require("../db/entities/CustomerUser");
const Discounts_1 = require("../db/entities/Discounts");
const Product_1 = require("../db/entities/Product");
const typeorm_2 = require("typeorm");
let CartService = class CartService {
    constructor(cartItemsRepo) {
        this.cartItemsRepo = cartItemsRepo;
    }
    async getItems(customerUserId) {
        const [results, activeCoupon, collections] = await Promise.all([
            this.cartItemsRepo.find({
                where: {
                    customerUser: {
                        customerUserId,
                    },
                    active: true,
                },
                relations: {
                    product: {
                        productImages: {
                            file: true,
                        },
                    },
                },
            }),
            this.cartItemsRepo.manager.findOne(CustomerCoupon_1.CustomerCoupon, {
                where: {
                    customerUser: {
                        customerUserId,
                    },
                    discount: {
                        active: true,
                    },
                    active: true,
                },
                relations: {
                    customerUser: true,
                    discount: true,
                },
            }),
            this.cartItemsRepo.manager.find(Collection_1.Collection, {
                where: {
                    productCollections: {
                        product: {
                            cartItems: {
                                customerUser: {
                                    customerUserId,
                                },
                            },
                        },
                        active: true,
                    },
                    isSale: true,
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
            results: results.map((i) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                const discountTagsIds = [
                    i.product.discountTagsIds,
                    ...collections === null || collections === void 0 ? void 0 : collections.filter((c) => {
                        var _a;
                        return (_a = c.productCollections) === null || _a === void 0 ? void 0 : _a.find((pc) => { var _a, _b; return ((_a = pc.product) === null || _a === void 0 ? void 0 : _a.productId) === ((_b = i.product) === null || _b === void 0 ? void 0 : _b.productId); });
                    }).map((c) => c.discountTagsIds),
                ];
                i.product.discountTagsIds = Array.from(new Set(discountTagsIds)).join(", ");
                if (discountTagsIds.includes((_a = activeCoupon === null || activeCoupon === void 0 ? void 0 : activeCoupon.discount) === null || _a === void 0 ? void 0 : _a.discountId)) {
                    const discountAmount = ((_b = activeCoupon === null || activeCoupon === void 0 ? void 0 : activeCoupon.discount) === null || _b === void 0 ? void 0 : _b.type) === "PERCENTAGE"
                        ? (parseFloat((_c = activeCoupon === null || activeCoupon === void 0 ? void 0 : activeCoupon.discount) === null || _c === void 0 ? void 0 : _c.value) / 100) *
                            Number((_e = (_d = i.product) === null || _d === void 0 ? void 0 : _d.price) !== null && _e !== void 0 ? _e : 0)
                        : parseFloat((_f = activeCoupon === null || activeCoupon === void 0 ? void 0 : activeCoupon.discount) === null || _f === void 0 ? void 0 : _f.value);
                    i.product["discountPrice"] =
                        Number((_h = (_g = i.product) === null || _g === void 0 ? void 0 : _g.price) !== null && _h !== void 0 ? _h : 0) - discountAmount;
                    i["appliedDiscount"] = true;
                }
                else {
                    i.product["discountPrice"] = Number((_k = (_j = i.product) === null || _j === void 0 ? void 0 : _j.price) !== null && _k !== void 0 ? _k : 0);
                }
                return i;
            }),
            activeCoupon,
            collections,
        };
    }
    async create(dto) {
        return await this.cartItemsRepo.manager.transaction(async (entityManager) => {
            var _a, _b;
            try {
                let cartItem = await entityManager.findOne(CartItems_1.CartItems, {
                    where: {
                        product: {
                            productId: dto.productId,
                        },
                        active: true,
                    },
                    relations: {
                        product: true,
                        customerUser: true,
                    },
                });
                if (!cartItem) {
                    cartItem = new CartItems_1.CartItems();
                    const product = await entityManager.findOne(Product_1.Product, {
                        where: {
                            productId: dto.productId,
                            active: true,
                        },
                    });
                    if (!product) {
                        throw Error("Product not found");
                    }
                    cartItem.product = product;
                    const customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                        where: {
                            customerUserId: dto.customerUserId,
                            active: true,
                        },
                    });
                    if (!customerUser) {
                        throw Error("Customer user not found");
                    }
                    cartItem.customerUser = customerUser;
                    cartItem.quantity = dto.quantity;
                    if (Number(product.price) !== Number(dto.price)) {
                        throw Error("Invalid price");
                    }
                    cartItem.createdAt = await (0, utils_1.getDate)();
                }
                else {
                    cartItem.quantity = (Number((_a = cartItem.quantity) !== null && _a !== void 0 ? _a : 0) + Number((_b = dto.quantity) !== null && _b !== void 0 ? _b : 0)).toString();
                    cartItem.product = await entityManager.findOne(Product_1.Product, {
                        where: {
                            productId: dto.productId,
                        },
                    });
                    if (Number(cartItem === null || cartItem === void 0 ? void 0 : cartItem.product.price) !== Number(dto.price)) {
                        throw Error("Invalid price");
                    }
                    cartItem.updatedAt = await (0, utils_1.getDate)();
                }
                cartItem.price = dto.price;
                cartItem = await entityManager.save(CartItems_1.CartItems, cartItem);
                return cartItem;
            }
            catch (ex) {
                throw ex;
            }
        });
    }
    async update(dto) {
        return await this.cartItemsRepo.manager.transaction(async (entityManager) => {
            const existingItems = await entityManager.find(CartItems_1.CartItems, {
                where: {
                    customerUser: { customerUserId: dto.customerUserId },
                    active: true,
                },
            });
            const existingMap = new Map(existingItems.map((item) => [item.cartItemId, item]));
            const updatedItems = [];
            for (const item of dto.items) {
                const existingItem = existingMap.get(item.cartItemId);
                if (!existingItem) {
                    throw new Error(cart_error_constant_1.CART_ITEM_ERROR_NOT_FOUND);
                }
                if (!existingItem.active) {
                    throw new Error(cart_error_constant_1.CART_ITEM_ERROR_DELETED);
                }
                existingItem.quantity = item.quantity;
                if (Number(item.quantity) <= 0) {
                    existingItem.active = false;
                }
                existingItem.updatedAt = await (0, utils_1.getDate)();
                const savedItem = await entityManager.save(CartItems_1.CartItems, existingItem);
                updatedItems.push(savedItem);
                existingMap.delete(item.cartItemId);
            }
            const itemsToRemove = Array.from(existingMap.values());
            for (const item of itemsToRemove) {
                item.updatedAt = await (0, utils_1.getDate)();
                await entityManager.remove(CartItems_1.CartItems, item);
            }
            return updatedItems;
        });
    }
    async manageCoupon(dto) {
        return await this.cartItemsRepo.manager.transaction(async (entityManager) => {
            const customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                where: {
                    customerUserId: dto.customerUserId,
                    active: true,
                },
            });
            if (!customerUser) {
                throw Error(customer_user_error_constant_1.CUSTOMER_USER_ERROR_USER_NOT_FOUND);
            }
            if (dto.promoCode && dto.promoCode !== "") {
                const discount = await entityManager.findOne(Discounts_1.Discounts, {
                    where: {
                        promoCode: dto.promoCode,
                        active: true,
                    },
                });
                if (!discount) {
                    throw Error("The coupon code you entered is invalid or has expired. Please try again.");
                }
                const cartItems = await entityManager
                    .createQueryBuilder(CartItems_1.CartItems, "cartItem")
                    .innerJoin("cartItem.product", "product")
                    .innerJoin("product.productCollections", "productCollections")
                    .innerJoin("productCollections.collection", "collection")
                    .where(`(',' || product."DiscountTagsIds" || ',') LIKE :discountid OR (',' || collection."DiscountTagsIds" || ',') LIKE :discountid`, {
                    discountid: `%,${discount.discountId},%`,
                })
                    .getMany();
                if (cartItems.length === 0) {
                    throw Error("The entered promo code is not valid for any items in your cart.");
                }
                let customerCoupon = await entityManager.findOne(CustomerCoupon_1.CustomerCoupon, {
                    where: {
                        customerUser: {
                            customerUserId: dto.customerUserId,
                        },
                        active: true,
                    },
                    relations: {
                        discount: true,
                    },
                });
                if (customerCoupon &&
                    (customerCoupon === null || customerCoupon === void 0 ? void 0 : customerCoupon.discount.discountId) !== discount.discountId) {
                    customerCoupon;
                    customerCoupon.discount = discount;
                }
                else {
                    customerCoupon = new CustomerCoupon_1.CustomerCoupon();
                    customerCoupon.customerUser = customerUser;
                    customerCoupon.discount = discount;
                }
                customerCoupon = await entityManager.save(CustomerCoupon_1.CustomerCoupon, customerCoupon);
                return await entityManager.findOne(CustomerCoupon_1.CustomerCoupon, {
                    where: {
                        customerUser: {
                            customerUserId: dto.customerUserId,
                        },
                        discount: {
                            promoCode: dto.promoCode,
                        },
                        active: true,
                    },
                    relations: {
                        discount: true,
                    },
                });
            }
            else {
                let customerCoupons = await entityManager.find(CustomerCoupon_1.CustomerCoupon, {
                    where: {
                        customerUser: {
                            customerUserId: dto.customerUserId,
                        },
                        active: true,
                    },
                    relations: {
                        discount: true,
                    },
                });
                if (customerCoupons.length > 0) {
                    customerCoupons.forEach((res) => {
                        res.active = false;
                    });
                    customerCoupons = await entityManager.save(CustomerCoupon_1.CustomerCoupon, customerCoupons);
                }
                return await entityManager.findOne(CustomerCoupon_1.CustomerCoupon, {
                    where: {
                        customerUser: {
                            customerUserId: dto.customerUserId,
                        },
                        active: true,
                    },
                    relations: {
                        discount: true,
                    },
                });
            }
        });
    }
    async getActiveCoupon(customerUserId) {
        const results = await this.cartItemsRepo.manager.findOne(CustomerCoupon_1.CustomerCoupon, {
            where: {
                customerUser: {
                    customerUserId,
                },
                discount: {
                    active: true,
                },
                active: true,
            },
            relations: {
                customerUser: true,
                discount: true,
            },
        });
        return results;
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(CartItems_1.CartItems)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map