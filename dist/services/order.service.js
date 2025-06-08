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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_constant_1 = require("../common/constant/order.constant");
const utils_1 = require("../common/utils/utils");
const CartItems_1 = require("../db/entities/CartItems");
const CustomerUser_1 = require("../db/entities/CustomerUser");
const Order_1 = require("../db/entities/Order");
const OrderItems_1 = require("../db/entities/OrderItems");
const typeorm_2 = require("typeorm");
const delivery_service_1 = require("./delivery.service");
const config_1 = require("@nestjs/config");
const CustomerCoupon_1 = require("../db/entities/CustomerCoupon");
const order_update_dto_1 = require("../core/dto/order/order.update.dto");
const Collection_1 = require("../db/entities/Collection");
let OrderService = class OrderService {
    constructor(orderRepo, deliveryService, config) {
        this.orderRepo = orderRepo;
        this.deliveryService = deliveryService;
        this.config = config;
        const coordinates = this.config.get("STORE_LOCATION_COORDINATES");
        this.STORE_LOCATION_COORDINATES = {
            lat: parseFloat(coordinates.split(",")[0] || "0"),
            lng: parseFloat(coordinates.split(",")[1] || "0"),
        };
    }
    async getByCustomerUser({ customerUserId, pageSize, pageIndex, keywords }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        keywords = keywords !== null && keywords !== void 0 ? keywords : "";
        const query = this.orderRepo
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.customerUser", "customerUser")
            .leftJoinAndSelect("order.orderItems", "orderItems")
            .leftJoinAndSelect("orderItems.product", "product")
            .leftJoinAndSelect("product.category", "category")
            .leftJoinAndSelect("product.productCollections", "productCollections")
            .where('"order"."Active" = true')
            .andWhere(new typeorm_2.Brackets((qb) => {
            qb.where(`
          "order"."CustomerUserId" = :customerUserId AND
          (
            "product"."SKU" ILIKE :keywords OR 
            "product"."Name" ILIKE :keywords OR 
            "product"."ShortDesc" ILIKE :keywords OR 
            "product"."LongDesc" ILIKE :keywords OR 
            "category"."Name" ILIKE :keywords OR 
            "category"."Desc" ILIKE :keywords
          )
          `, {
                keywords: `%${keywords}%`,
                customerUserId,
            });
        }));
        const queryResults = take > 0 ? query.skip(skip).take(take) : query;
        const [results, total] = await Promise.all([
            queryResults.getMany(),
            query.getCount(),
        ]);
        return {
            results,
            total,
        };
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.orderRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                relations: {
                    customerUser: true,
                    orderItems: {
                        product: {
                            category: true,
                            productCollections: true,
                        },
                    },
                },
                skip,
                take,
                order,
            }),
            this.orderRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByOrderCode(orderCode) {
        const result = await this.orderRepo.findOne({
            where: {
                orderCode,
                active: true,
            },
            relations: {
                orderItems: {
                    product: {
                        productImages: {
                            file: true,
                        },
                        category: {
                            thumbnailFile: true,
                        },
                    },
                },
            },
        });
        if (!result) {
            throw Error(order_constant_1.ORDER_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.orderRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c, _d, _e, _f;
            try {
                let order = new Order_1.Order();
                const customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                    where: {
                        customerUserId: dto.customerUserId,
                    },
                    relations: {},
                });
                if (!customerUser) {
                    throw Error(order_constant_1.ORDER_ERROR_NOT_FOUND);
                }
                order.customerUser = customerUser;
                order.name = customerUser.name;
                order.email = dto.email;
                order.mobileNumber = dto.mobileNumber;
                order.paymentMethod = dto.paymentMethod;
                order.createdAt = await (0, utils_1.getDate)();
                order.deliveryAddress =
                    await this.deliveryService.getAddressNameFromCoordinates(dto.deliveryAddressCoordinates.lat, dto.deliveryAddressCoordinates.lng);
                order.deliveryAddressCoordinates = dto.deliveryAddressCoordinates;
                order.specialInstructions = dto.specialInstructions || null;
                order.notesToRider = dto.notesToRider || null;
                order = await entityManager.save(Order_1.Order, order);
                let subtotal = 0;
                let cartItems = [];
                let netDiscountAmount = 0;
                const currentDiscount = await entityManager.findOne(CustomerCoupon_1.CustomerCoupon, {
                    where: {
                        customerUser: {
                            customerUserId: dto.customerUserId,
                        },
                    },
                    relations: {
                        discount: true,
                    },
                });
                if (dto.cartItemIds && dto.cartItemIds.length > 0) {
                    cartItems = await entityManager.find(CartItems_1.CartItems, {
                        where: {
                            cartItemId: (0, typeorm_2.In)(dto.cartItemIds),
                            active: true,
                        },
                        relations: {
                            product: {
                                productImages: {
                                    file: true,
                                },
                                category: {
                                    thumbnailFile: true,
                                },
                            },
                        },
                    });
                    subtotal = cartItems.reduce((sum, item) => {
                        const price = parseFloat(item.price || "0");
                        const quantity = parseFloat(item.quantity || "1");
                        return sum + quantity * price;
                    }, 0);
                    const collections = await entityManager.find(Collection_1.Collection, {
                        where: {
                            productCollections: {
                                product: {
                                    productId: (0, typeorm_2.In)(dto.cartItemIds.map((id) => Number(id))),
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
                    });
                    const orderItems = [];
                    for (const cartItem of cartItems) {
                        const orderItem = new OrderItems_1.OrderItems();
                        orderItem.product = cartItem.product;
                        orderItem.order = order;
                        orderItem.quantity = cartItem.quantity;
                        orderItem.price = cartItem.price;
                        const itemTotalAmount = Number((_a = cartItem.price) !== null && _a !== void 0 ? _a : 0) *
                            Number(Number((_b = cartItem.quantity) !== null && _b !== void 0 ? _b : 0));
                        const discountTagsIds = [
                            cartItem.product.discountTagsIds,
                            ...collections === null || collections === void 0 ? void 0 : collections.filter((c) => {
                                var _a;
                                return (_a = c.productCollections) === null || _a === void 0 ? void 0 : _a.find((pc) => { var _a, _b; return ((_a = pc.product) === null || _a === void 0 ? void 0 : _a.productId) === ((_b = cartItem.product) === null || _b === void 0 ? void 0 : _b.productId); });
                            }).map((c) => c.discountTagsIds),
                        ];
                        if (discountTagsIds.includes((_c = currentDiscount === null || currentDiscount === void 0 ? void 0 : currentDiscount.discount) === null || _c === void 0 ? void 0 : _c.discountId)) {
                            const discountAmount = ((_d = currentDiscount === null || currentDiscount === void 0 ? void 0 : currentDiscount.discount) === null || _d === void 0 ? void 0 : _d.type) === "PERCENTAGE"
                                ? (parseFloat((_e = currentDiscount === null || currentDiscount === void 0 ? void 0 : currentDiscount.discount) === null || _e === void 0 ? void 0 : _e.value) / 100) *
                                    itemTotalAmount
                                : parseFloat((_f = currentDiscount === null || currentDiscount === void 0 ? void 0 : currentDiscount.discount) === null || _f === void 0 ? void 0 : _f.value);
                            orderItem.totalAmount = (itemTotalAmount - discountAmount).toString();
                            netDiscountAmount =
                                netDiscountAmount + Number(orderItem.totalAmount);
                        }
                        else {
                            orderItem.totalAmount = itemTotalAmount.toString();
                        }
                        orderItems.push(orderItem);
                        cartItem.active = false;
                        cartItem.updatedAt = await (0, utils_1.getDate)();
                    }
                    await entityManager.save(OrderItems_1.OrderItems, orderItems);
                    await entityManager.save(CartItems_1.CartItems, cartItems);
                }
                order.subtotal = subtotal.toString();
                order.discount = (subtotal - netDiscountAmount).toString();
                const delivery = await this.deliveryService.calculateDeliveryFee(this.STORE_LOCATION_COORDINATES, dto.deliveryAddressCoordinates);
                order.deliveryFee = delivery.deliveryFee.toString();
                order.total = (netDiscountAmount + delivery.deliveryFee).toString();
                order.orderCode = (0, utils_1.generateIndentityCode)(order.orderId);
                order = await entityManager.save(Order_1.Order, order);
                order = await entityManager.findOne(Order_1.Order, {
                    where: {
                        orderId: order.orderId,
                    },
                    relations: {
                        orderItems: {
                            product: {
                                thumbnailFile: true,
                                category: true,
                            },
                        },
                        customerUser: true,
                    },
                });
                return order;
            }
            catch (ex) {
                throw ex;
            }
        });
    }
    async updateStatus(orderCode, dto) {
        return await this.orderRepo.manager.transaction(async (entityManager) => {
            try {
                let order = await entityManager.findOne(Order_1.Order, {
                    where: {
                        orderCode: orderCode,
                        active: true,
                    },
                    relations: {
                        customerUser: true,
                    },
                });
                if (!order) {
                    throw Error(order_constant_1.ORDER_ERROR_NOT_FOUND);
                }
                if (order.status === dto.status &&
                    dto.status === order_update_dto_1.UpdateStatusEnums.DELIVERY) {
                    throw Error("Order already in delivery");
                }
                if (order.status === dto.status &&
                    dto.status === order_update_dto_1.UpdateStatusEnums.CANCELLED) {
                    throw Error("Order already in delivery");
                }
                if (order.status === dto.status &&
                    dto.status === order_update_dto_1.UpdateStatusEnums.COMPLETED) {
                    throw Error("Order already in delivery");
                }
                if (order.status === order_update_dto_1.UpdateStatusEnums.COMPLETED &&
                    (dto.status === order_update_dto_1.UpdateStatusEnums.DELIVERY ||
                        dto.status === order_update_dto_1.UpdateStatusEnums.CANCELLED)) {
                    throw Error("Order already in compeleted");
                }
                if (order.status === order_update_dto_1.UpdateStatusEnums.DELIVERY &&
                    (dto.status === order_update_dto_1.UpdateStatusEnums.CANCELLED ||
                        dto.status === order_update_dto_1.UpdateStatusEnums.COMPLETED)) {
                    throw Error("Order already in delivery");
                }
                if (order.status === order_update_dto_1.UpdateStatusEnums.CANCELLED &&
                    (dto.status === order_update_dto_1.UpdateStatusEnums.DELIVERY ||
                        dto.status === order_update_dto_1.UpdateStatusEnums.COMPLETED)) {
                    throw Error("Order already in cancelled");
                }
                order.status = dto.status;
                order = await entityManager.save(Order_1.Order, order);
                return order;
            }
            catch (ex) {
                throw ex;
            }
        });
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Order_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        delivery_service_1.DeliveryService,
        config_1.ConfigService])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map