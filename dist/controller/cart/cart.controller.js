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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const cart_customer_coupon_dto_1 = require("../../core/dto/cart-item/cart-customer-coupon.dto");
const cart_item_create_dto_1 = require("../../core/dto/cart-item/cart-item.create.dto");
const cart_item_update_dto_1 = require("../../core/dto/cart-item/cart-item.update.dto");
const cart_service_1 = require("../../services/cart.service");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getItems(customerUserId) {
        const res = {};
        try {
            res.data = await this.cartService.getItems(customerUserId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(dto) {
        const res = {};
        try {
            res.data = await this.cartService.create(dto);
            res.success = true;
            res.message = `Cart item ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(dto) {
        const res = {};
        try {
            res.data = await this.cartService.update(dto);
            res.success = true;
            res.message = `Cart item ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async manageCoupon(dto) {
        const res = {};
        try {
            res.data = await this.cartService.manageCoupon(dto);
            res.success = true;
            res.message = `Customer coupon ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getActiveCoupon(customerUserId) {
        const res = {};
        try {
            res.data = await this.cartService.getActiveCoupon(customerUserId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
};
__decorate([
    (0, common_1.Get)("/getItems/:customerUserId"),
    __param(0, (0, common_1.Param)("customerUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getItems", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_item_create_dto_1.CreateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_item_update_dto_1.UpdateCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("/coupon"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_customer_coupon_dto_1.CartCustomerCouponDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "manageCoupon", null);
__decorate([
    (0, common_1.Get)("/customerUserCoupon/:customerUserId"),
    __param(0, (0, common_1.Param)("customerUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getActiveCoupon", null);
CartController = __decorate([
    (0, swagger_1.ApiTags)("cart"),
    (0, common_1.Controller)("cart"),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map