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
exports.AIController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("../../services/ai.service");
let AIController = class AIController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async create(dto) {
        const res = {};
        try {
            res.data = await this.aiService.handleSearch(dto.query);
            res.success = true;
            res.message = `Query ${dto.query}`;
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
    (0, common_1.Post)("search"),
    (0, swagger_1.ApiBody)({
        description: "The query object for AI search",
        required: true,
        schema: {
            type: "object",
            properties: {
                query: { type: "string", example: "red roses bouquet" },
            },
            required: ["query"],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "create", null);
AIController = __decorate([
    (0, swagger_1.ApiTags)("ai"),
    (0, common_1.Controller)("ai"),
    __metadata("design:paramtypes", [ai_service_1.AIService])
], AIController);
exports.AIController = AIController;
//# sourceMappingURL=ai.controller.js.map