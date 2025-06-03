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
exports.StaffUserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const staff_user_create_dto_1 = require("../../core/dto/staff-user/staff-user.create.dto");
const staff_user_update_dto_1 = require("../../core/dto/staff-user/staff-user.update.dto");
const staff_user_service_1 = require("../../services/staff-user.service");
let StaffUserController = class StaffUserController {
    constructor(staffUserService) {
        this.staffUserService = staffUserService;
    }
    async getByCode(staffUserCode) {
        const res = {};
        try {
            res.data = await this.staffUserService.getByCode(staffUserCode);
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
            res.data = await this.staffUserService.getPagination(paginationParams);
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
            res.data = await this.staffUserService.create(dto);
            res.success = true;
            res.message = `User  ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateProfile(staffUserCode, dto) {
        const res = {};
        try {
            res.data = await this.staffUserService.updateProfile(staffUserCode, dto);
            res.success = true;
            res.message = `User ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(staffUserCode, dto) {
        const res = {};
        try {
            res.data = await this.staffUserService.update(staffUserCode, dto);
            res.success = true;
            res.message = `User ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(staffUserCode) {
        const res = {};
        try {
            res.data = await this.staffUserService.delete(staffUserCode);
            res.success = true;
            res.message = `User ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:staffUserCode"),
    __param(0, (0, common_1.Param)("staffUserCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffUserController.prototype, "getByCode", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], StaffUserController.prototype, "getPagination", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_user_create_dto_1.CreateStaffUserDto]),
    __metadata("design:returntype", Promise)
], StaffUserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/updateProfile/:staffUserCode"),
    __param(0, (0, common_1.Param)("staffUserCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, staff_user_update_dto_1.UpdateStaffUserProfileDto]),
    __metadata("design:returntype", Promise)
], StaffUserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)("/:staffUserCode"),
    __param(0, (0, common_1.Param)("staffUserCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, staff_user_update_dto_1.UpdateStaffUserDto]),
    __metadata("design:returntype", Promise)
], StaffUserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:staffUserCode"),
    __param(0, (0, common_1.Param)("staffUserCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffUserController.prototype, "delete", null);
StaffUserController = __decorate([
    (0, swagger_1.ApiTags)("staff-user"),
    (0, common_1.Controller)("staff-user"),
    __metadata("design:paramtypes", [staff_user_service_1.StaffUserService])
], StaffUserController);
exports.StaffUserController = StaffUserController;
//# sourceMappingURL=staff-user.controller.js.map