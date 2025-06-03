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
exports.StaffAccessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const staff_access_create_dto_1 = require("../../core/dto/staff-access/staff-access.create.dto");
const staff_access_update_dto_1 = require("../../core/dto/staff-access/staff-access.update.dto");
const staff_access_service_1 = require("../../services/staff-access.service");
let StaffAccessController = class StaffAccessController {
    constructor(staffAccessService) {
        this.staffAccessService = staffAccessService;
    }
    async getDetails(staffAccessCode) {
        const res = {};
        try {
            res.data = await this.staffAccessService.getByCode(staffAccessCode);
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
            res.data = await this.staffAccessService.getPagination(params);
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
            res.data = await this.staffAccessService.create(accessDto);
            res.success = true;
            res.message = `User group ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(staffAccessCode, dto) {
        const res = {};
        try {
            res.data = await this.staffAccessService.update(staffAccessCode, dto);
            res.success = true;
            res.message = `User group ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(staffAccessCode) {
        const res = {};
        try {
            res.data = await this.staffAccessService.delete(staffAccessCode);
            res.success = true;
            res.message = `User group ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:staffAccessCode"),
    __param(0, (0, common_1.Param)("staffAccessCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffAccessController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], StaffAccessController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_access_create_dto_1.CreateStaffAccessDto]),
    __metadata("design:returntype", Promise)
], StaffAccessController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:staffAccessCode"),
    __param(0, (0, common_1.Param)("staffAccessCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, staff_access_update_dto_1.UpdateStaffAccessDto]),
    __metadata("design:returntype", Promise)
], StaffAccessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:staffAccessCode"),
    __param(0, (0, common_1.Param)("staffAccessCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffAccessController.prototype, "delete", null);
StaffAccessController = __decorate([
    (0, swagger_1.ApiTags)("staff-access"),
    (0, common_1.Controller)("staff-access"),
    __metadata("design:paramtypes", [staff_access_service_1.StaffAccessService])
], StaffAccessController);
exports.StaffAccessController = StaffAccessController;
//# sourceMappingURL=staff-access.controller.js.map