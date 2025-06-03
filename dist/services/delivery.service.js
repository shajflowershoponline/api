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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const system_config_service_1 = require("./system-config.service");
let DeliveryService = class DeliveryService {
    constructor(config, systemConfigService, httpService) {
        this.config = config;
        this.systemConfigService = systemConfigService;
        this.httpService = httpService;
        this.DELIVERY_RATE = 10;
        this.systemConfig = [];
        this.OPENROUTESERVICE_API_URL = this.config.get("OPENROUTESERVICE_API_URL");
        this.OPENROUTESERVICE_API_KEY = this.config.get("OPENROUTESERVICE_API_KEY");
    }
    async loadSystemConfig() {
        this.systemConfig = await this.systemConfigService.getAll();
        const deliveryRate = this.systemConfig.find((x) => x.key === "DELIVERY_RATE");
        this.DELIVERY_RATE = deliveryRate ? Number(deliveryRate.value) : 10;
    }
    async calculateDeliveryFee(pickupCoords, dropoffCoords) {
        var _a, _b, _c, _d, _e;
        await this.loadSystemConfig();
        const start = `${pickupCoords.lng},${pickupCoords.lat}`;
        const end = `${dropoffCoords.lng},${dropoffCoords.lat}`;
        const url = `${this.OPENROUTESERVICE_API_URL}/v2/directions/driving-car`;
        try {
            const response$ = this.httpService.get(url, {
                params: {
                    start,
                    end,
                },
                headers: {
                    Authorization: this.OPENROUTESERVICE_API_KEY,
                },
            });
            const response = await (0, rxjs_1.lastValueFrom)(response$);
            const summary = (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.features) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.properties) === null || _d === void 0 ? void 0 : _d.summary;
            if (!summary) {
                throw new Error("No summary data found in route response");
            }
            const distanceInMeters = summary.distance;
            const distanceInKm = distanceInMeters / 1000;
            const deliveryFee = distanceInKm >= 1
                ? distanceInKm * this.DELIVERY_RATE
                : this.DELIVERY_RATE;
            return {
                distanceInKm: +distanceInKm.toFixed(2),
                deliveryFee: +deliveryFee.toFixed(2),
            };
        }
        catch (error) {
            console.error("Error calculating delivery fee:", error.message, ((_e = error.response) === null || _e === void 0 ? void 0 : _e.data) || "");
            throw new Error("Failed to calculate delivery fee");
        }
    }
    async getAddressNameFromCoordinates(lat, lon) {
        var _a, _b;
        const url = `${this.OPENROUTESERVICE_API_URL}/geocode/reverse`;
        const params = {
            api_key: this.OPENROUTESERVICE_API_KEY,
            "point.lat": lat,
            "point.lon": lon,
        };
        try {
            const response$ = this.httpService.get(url, { params });
            const response = await (0, rxjs_1.lastValueFrom)(response$);
            const features = (_a = response.data) === null || _a === void 0 ? void 0 : _a.features;
            if (features && features.length > 0) {
                return ((_b = features[0].properties) === null || _b === void 0 ? void 0 : _b.label) || null;
            }
            return null;
        }
        catch (error) {
            console.error("Reverse geocoding failed:", error.message);
            return null;
        }
    }
};
DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        system_config_service_1.SystemConfigService,
        axios_1.HttpService])
], DeliveryService);
exports.DeliveryService = DeliveryService;
//# sourceMappingURL=delivery.service.js.map