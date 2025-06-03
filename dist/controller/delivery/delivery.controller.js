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
exports.DeliveryController = void 0;
const delivery_service_1 = require("../../services/delivery.service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let DeliveryController = class DeliveryController {
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
    }
    async search(body) {
        const res = {};
        try {
            res.data = await this.deliveryService.calculateDeliveryFee(body.pickupCoords, body.dropoffCoords);
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
    (0, common_1.Post)("calculate"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                pickupCoords: {
                    type: "object",
                    properties: {
                        lat: { type: "number", example: 123.456 },
                        lng: { type: "number", example: 78.91 },
                    },
                    required: ["lat", "lng"],
                },
                dropoffCoords: {
                    type: "object",
                    properties: {
                        lat: { type: "number", example: 321.654 },
                        lng: { type: "number", example: 98.765 },
                    },
                    required: ["lat", "lng"],
                },
            },
            required: ["pickupCoords", "dropoffCoords"],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "search", null);
DeliveryController = __decorate([
    (0, swagger_1.ApiTags)("delivery"),
    (0, common_1.Controller)("delivery"),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService])
], DeliveryController);
exports.DeliveryController = DeliveryController;
//# sourceMappingURL=delivery.controller.js.map