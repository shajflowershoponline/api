"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const order_controller_1 = require("./order.controller");
const Order_1 = require("../../db/entities/Order");
const OrderItems_1 = require("../../db/entities/OrderItems");
const order_service_1 = require("../../services/order.service");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const delivery_service_1 = require("../../services/delivery.service");
const system_config_service_1 = require("../../services/system-config.service");
const SystemConfig_1 = require("../../db/entities/SystemConfig");
let OrderModule = class OrderModule {
};
OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([Order_1.Order, OrderItems_1.OrderItems, SystemConfig_1.SystemConfig]),
        ],
        controllers: [order_controller_1.OrderController],
        providers: [order_service_1.OrderService, delivery_service_1.DeliveryService, system_config_service_1.SystemConfigService],
        exports: [order_service_1.OrderService],
    })
], OrderModule);
exports.OrderModule = OrderModule;
//# sourceMappingURL=order.module.js.map