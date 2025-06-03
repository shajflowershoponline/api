"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const Discounts_1 = require("../../db/entities/Discounts");
const discounts_service_1 = require("../../services/discounts.service");
const discounts_controller_1 = require("./discounts.controller");
let DiscountsModule = class DiscountsModule {
};
DiscountsModule = __decorate([
    (0, common_1.Module)({
        imports: [firebase_provider_module_1.FirebaseProviderModule, typeorm_1.TypeOrmModule.forFeature([Discounts_1.Discounts])],
        controllers: [discounts_controller_1.DiscountsController],
        providers: [discounts_service_1.DiscountsService],
        exports: [discounts_service_1.DiscountsService],
    })
], DiscountsModule);
exports.DiscountsModule = DiscountsModule;
//# sourceMappingURL=discounts.module.js.map