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
exports.CustomerUserWishListController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const customer_user_wish_list_create_dto_1 = require("../../core/dto/customer-user-wish-list/customer-user-wish-list.create.dto");
const customer_user_wish_list_service_1 = require("../../services/customer-user-wish-list.service");
let CustomerUserWishListController = class CustomerUserWishListController {
    constructor(customerUserWishlistService) {
        this.customerUserWishlistService = customerUserWishlistService;
    }
    async getDetails(customerUserWishlistId) {
        const res = {};
        try {
            res.data = await this.customerUserWishlistService.getById(customerUserWishlistId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getBySKU(customerUserId, sku) {
        const res = {};
        try {
            res.data = await this.customerUserWishlistService.getBySKU(customerUserId, sku);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = (await this.customerUserWishlistService.getPagination(params));
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(accessDto) {
        const res = {};
        try {
            res.data = await this.customerUserWishlistService.create(accessDto);
            res.success = true;
            res.message = `Customer User Wishlist ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(customerUserWishlistId) {
        const res = {};
        try {
            res.data = await this.customerUserWishlistService.delete(customerUserWishlistId);
            res.success = true;
            res.message = `Customer User Wishlist ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:customerUserWishlistId"),
    __param(0, (0, common_1.Param)("customerUserWishlistId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerUserWishListController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Get)("/get-by-sku/:customerUserId/:sku"),
    __param(0, (0, common_1.Param)("customerUserId")),
    __param(1, (0, common_1.Param)("sku")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerUserWishListController.prototype, "getBySKU", null);
__decorate([
    (0, common_1.Post)("/page"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                customerUserId: { type: "string" },
                pageSize: { type: "number", example: 10 },
                pageIndex: { type: "number", example: 0 },
                order: { type: "object", default: { name: "ASC" } },
                keywords: { type: "string", example: "", default: "" },
            },
            required: [
                "customerUserId",
                "pageSize",
                "pageIndex",
                "order",
                "keywords",
            ],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerUserWishListController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_user_wish_list_create_dto_1.CreateCustomerUserWishlistDto]),
    __metadata("design:returntype", Promise)
], CustomerUserWishListController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)("/:customerUserWishlistId"),
    __param(0, (0, common_1.Param)("customerUserWishlistId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerUserWishListController.prototype, "delete", null);
CustomerUserWishListController = __decorate([
    (0, swagger_1.ApiTags)("customer-user-wish-list"),
    (0, common_1.Controller)("customer-user-wish-list"),
    __metadata("design:paramtypes", [customer_user_wish_list_service_1.CustomerUserWishListService])
], CustomerUserWishListController);
exports.CustomerUserWishListController = CustomerUserWishListController;
//# sourceMappingURL=customer-user-wish-list.controller.js.map