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
exports.CustomerUserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const customer_user_create_dto_1 = require("../../core/dto/customer-user/customer-user.create.dto");
const customer_user_update_dto_1 = require("../../core/dto/customer-user/customer-user.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const customer_user_service_1 = require("../../services/customer-user.service");
let CustomerUserController = class CustomerUserController {
    constructor(customerUserService) {
        this.customerUserService = customerUserService;
    }
    async getByCode(customerUserCode) {
        const res = {};
        try {
            res.data = await this.customerUserService.getByCode(customerUserCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPagination(paginationParams) {
        const res = {};
        try {
            res.data = await this.customerUserService.getPagination(paginationParams);
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
            res.data = await this.customerUserService.create(dto);
            res.success = true;
            res.message = `Customer user ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateProfile(customerUserCode, dto) {
        const res = {};
        try {
            res.data = await this.customerUserService.updateProfile(customerUserCode, dto);
            res.success = true;
            res.message = `Customer user ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(customerUserCode, dto) {
        const res = {};
        try {
            res.data = await this.customerUserService.update(customerUserCode, dto);
            res.success = true;
            res.message = `Customer user ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(customerUserCode) {
        const res = {};
        try {
            res.data = await this.customerUserService.delete(customerUserCode);
            res.success = true;
            res.message = `Customer user ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:customerUserCode"),
    __param(0, (0, common_1.Param)("customerUserCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerUserController.prototype, "getByCode", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], CustomerUserController.prototype, "getPagination", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_user_create_dto_1.CreateCustomerUserDto]),
    __metadata("design:returntype", Promise)
], CustomerUserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/updateProfile/:customerUserCode"),
    __param(0, (0, common_1.Param)("customerUserCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_user_update_dto_1.UpdateCustomerUserProfileDto]),
    __metadata("design:returntype", Promise)
], CustomerUserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)("/:customerUserCode"),
    __param(0, (0, common_1.Param)("usercustomerUserCodeCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_user_update_dto_1.UpdateCustomerUserDto]),
    __metadata("design:returntype", Promise)
], CustomerUserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:customerUserCode"),
    __param(0, (0, common_1.Param)("customerUserCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerUserController.prototype, "delete", null);
CustomerUserController = __decorate([
    (0, swagger_1.ApiTags)("customer-user"),
    (0, common_1.Controller)("customer-user"),
    __metadata("design:paramtypes", [customer_user_service_1.CustomerUserService])
], CustomerUserController);
exports.CustomerUserController = CustomerUserController;
//# sourceMappingURL=customer-user.controller.js.map