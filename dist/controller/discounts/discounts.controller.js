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
exports.DiscountsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const discounts_create_dto_1 = require("../../core/dto/discounts/discounts.create.dto");
const discounts_update_dto_1 = require("../../core/dto/discounts/discounts.update.dto");
const discounts_service_1 = require("../../services/discounts.service");
let DiscountsController = class DiscountsController {
    constructor(discountService) {
        this.discountService = discountService;
    }
    async getDetails(discountsId) {
        const res = {};
        try {
            res.data = await this.discountService.getById(discountsId);
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
            res.data = (await this.discountService.getPagination(params));
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
            res.data = await this.discountService.create(accessDto);
            res.success = true;
            res.message = `Discounts ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(discountsId, dto) {
        const res = {};
        try {
            res.data = await this.discountService.update(discountsId, dto);
            res.success = true;
            res.message = `Discounts ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(discountsId) {
        const res = {};
        try {
            res.data = await this.discountService.delete(discountsId);
            res.success = true;
            res.message = `Discounts ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:discountsId"),
    __param(0, (0, common_1.Param)("discountsId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                pageSize: { type: "number", example: 10 },
                pageIndex: { type: "number", example: 0 },
                order: { type: "object", default: { name: "ASC" } },
                keywords: { type: "string", example: "", default: "" },
            },
            required: ["pageSize", "pageIndex", "order", "keywords"],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discounts_create_dto_1.CreateDiscountDto]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:discountsId"),
    __param(0, (0, common_1.Param)("discountsId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, discounts_update_dto_1.UpdateDiscountDto]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:discountsId"),
    __param(0, (0, common_1.Param)("discountsId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "delete", null);
DiscountsController = __decorate([
    (0, swagger_1.ApiTags)("discounts"),
    (0, common_1.Controller)("discounts"),
    __metadata("design:paramtypes", [discounts_service_1.DiscountsService])
], DiscountsController);
exports.DiscountsController = DiscountsController;
//# sourceMappingURL=discounts.controller.js.map