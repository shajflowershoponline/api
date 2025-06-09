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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const product_create_dto_1 = require("../../core/dto/product/product.create.dto");
const product_update_dto_1 = require("../../core/dto/product/product.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const product_service_1 = require("../../services/product.service");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async getAllFeaturedProducts(customerUserId) {
        const res = {};
        try {
            res.data = await this.productService.getAllFeaturedProducts(customerUserId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getDetails(sku) {
        const res = {};
        try {
            res.data = await this.productService.getBySku(sku);
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
            res.data = await this.productService.getPagination(paginationParams);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getClientPagination(params) {
        const res = {};
        try {
            res.data = await this.productService.getClientPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getSearchFilter(params) {
        const res = {};
        try {
            res.data = await this.productService.getSearchFilter(params);
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
            res.data = await this.productService.create(accessDto);
            res.success = true;
            res.message = `Product ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(sku, dto) {
        const res = {};
        try {
            res.data = await this.productService.update(sku, dto);
            res.success = true;
            res.message = `Product ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(sku) {
        const res = {};
        try {
            res.data = await this.productService.delete(sku);
            res.success = true;
            res.message = `Product ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/featured/:customerUserId"),
    __param(0, (0, common_1.Param)("customerUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllFeaturedProducts", null);
__decorate([
    (0, common_1.Get)("/:sku"),
    __param(0, (0, common_1.Param)("sku")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getPagination", null);
__decorate([
    (0, common_1.Post)("/client-pagination"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                pageSize: { type: "string" },
                pageIndex: { type: "string" },
                order: { type: "object" },
                customerUserId: { type: "string" },
                keyword: { type: "string" },
                columnDef: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            apiNotation: { type: "string" },
                            filter: { type: "string" },
                            name: { type: "string" },
                            type: { type: "string" },
                        },
                        required: ["apiNotation"],
                    },
                },
            },
            required: ["pageSize", "pageIndex", "columnDef", "keyword"],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getClientPagination", null);
__decorate([
    (0, common_1.Post)("/get-search-filter"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                columnDef: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            apiNotation: { type: "string" },
                            filter: { type: "string" },
                            name: { type: "string" },
                            type: { type: "string" },
                        },
                        required: ["apiNotation"],
                    },
                },
            },
            required: ["columnDef"],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getSearchFilter", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_create_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:sku"),
    __param(0, (0, common_1.Param)("sku")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_update_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:sku"),
    __param(0, (0, common_1.Param)("sku")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "delete", null);
ProductController = __decorate([
    (0, swagger_1.ApiTags)("product"),
    (0, common_1.Controller)("product"),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map