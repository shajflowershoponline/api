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
exports.GiftAddOnsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const gift_add_ons_create_dto_1 = require("../../core/dto/gift-add-ons/gift-add-ons.create.dto");
const gift_add_ons_update_dto_1 = require("../../core/dto/gift-add-ons/gift-add-ons.update.dto");
const gift_add_ons_service_1 = require("../../services/gift-add-ons.service");
let GiftAddOnsController = class GiftAddOnsController {
    constructor(giftAddOnsService) {
        this.giftAddOnsService = giftAddOnsService;
    }
    async getDetails(giftAddOnId) {
        const res = {};
        try {
            res.data = await this.giftAddOnsService.getById(giftAddOnId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginated(params = { pageSize: "10", pageIndex: "0", order: { name: "ASC" }, keywords: "" }) {
        const res = {};
        try {
            res.data = await this.giftAddOnsService.getPagination(params);
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
            res.data = await this.giftAddOnsService.create(accessDto);
            res.success = true;
            res.message = `Gift Add Ons ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(giftAddOnId, dto) {
        const res = {};
        try {
            res.data = await this.giftAddOnsService.update(giftAddOnId, dto);
            res.success = true;
            res.message = `Gift Add Ons ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(giftAddOnId) {
        const res = {};
        try {
            res.data = await this.giftAddOnsService.delete(giftAddOnId);
            res.success = true;
            res.message = `Gift Add Ons ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:giftAddOnId"),
    __param(0, (0, common_1.Param)("giftAddOnId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftAddOnsController.prototype, "getDetails", null);
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
], GiftAddOnsController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gift_add_ons_create_dto_1.CreateGiftAddOnDto]),
    __metadata("design:returntype", Promise)
], GiftAddOnsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:giftAddOnId"),
    __param(0, (0, common_1.Param)("giftAddOnId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gift_add_ons_update_dto_1.UpdateGiftAddOnDto]),
    __metadata("design:returntype", Promise)
], GiftAddOnsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:giftAddOnId"),
    __param(0, (0, common_1.Param)("giftAddOnId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftAddOnsController.prototype, "delete", null);
GiftAddOnsController = __decorate([
    (0, swagger_1.ApiTags)("gift-add-ons"),
    (0, common_1.Controller)("gift-add-ons"),
    __metadata("design:paramtypes", [gift_add_ons_service_1.GiftAddOnsService])
], GiftAddOnsController);
exports.GiftAddOnsController = GiftAddOnsController;
//# sourceMappingURL=gift-add-ons.controller.js.map