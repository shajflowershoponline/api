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
exports.CollectionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const collection_create_dto_1 = require("../../core/dto/collection/collection.create.dto");
const collection_update_dto_1 = require("../../core/dto/collection/collection.update.dto");
const collection_service_1 = require("../../services/collection.service");
let CollectionController = class CollectionController {
    constructor(collectionService) {
        this.collectionService = collectionService;
    }
    async getById(collectionId) {
        const res = {};
        try {
            res.data = await this.collectionService.getById(collectionId);
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
            res.data = await this.collectionService.getPagination(params);
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
            res.data = await this.collectionService.create(accessDto);
            res.success = true;
            res.message = `Collection ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateOrder(dto) {
        const res = {};
        try {
            res.data = await this.collectionService.updateOrder(dto);
            res.success = true;
            res.message = `Collection ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(collectionId, dto) {
        const res = {};
        try {
            res.data = await this.collectionService.update(collectionId, dto);
            res.success = true;
            res.message = `Collection ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(collectionId) {
        const res = {};
        try {
            res.data = await this.collectionService.delete(collectionId);
            res.success = true;
            res.message = `Collection ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:collectionId"),
    __param(0, (0, common_1.Param)("collectionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)("/page"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                pageSize: { type: "number", example: 10 },
                pageIndex: { type: "number", example: 0 },
                order: { type: "object", default: { sequenceId: "ASC" } },
                keywords: { type: "string", example: "", default: "" },
            },
            required: ["pageSize", "pageIndex", "order", "keywords"],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [collection_create_dto_1.CreateCollectionDto]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/updateOrder"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Put)("/:collectionId"),
    __param(0, (0, common_1.Param)("collectionId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, collection_update_dto_1.UpdateCollectionDto]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:collectionId"),
    __param(0, (0, common_1.Param)("collectionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "delete", null);
CollectionController = __decorate([
    (0, swagger_1.ApiTags)("collection"),
    (0, common_1.Controller)("collection"),
    __metadata("design:paramtypes", [collection_service_1.CollectionService])
], CollectionController);
exports.CollectionController = CollectionController;
//# sourceMappingURL=collection.controller.js.map