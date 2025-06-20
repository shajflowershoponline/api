"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryModule = void 0;
const delivery_service_1 = require("../../services/delivery.service");
const common_1 = require("@nestjs/common");
const delivery_controller_1 = require("./delivery.controller");
const axios_1 = require("@nestjs/axios");
const system_config_service_1 = require("../../services/system-config.service");
const typeorm_1 = require("@nestjs/typeorm");
const SystemConfig_1 = require("../../db/entities/SystemConfig");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
let DeliveryModule = class DeliveryModule {
};
DeliveryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            firebase_provider_module_1.FirebaseProviderModule,
            typeorm_1.TypeOrmModule.forFeature([SystemConfig_1.SystemConfig]),
        ],
        controllers: [delivery_controller_1.DeliveryController],
        providers: [delivery_service_1.DeliveryService, system_config_service_1.SystemConfigService],
        exports: [delivery_service_1.DeliveryService],
    })
], DeliveryModule);
exports.DeliveryModule = DeliveryModule;
//# sourceMappingURL=delivery.module.js.map