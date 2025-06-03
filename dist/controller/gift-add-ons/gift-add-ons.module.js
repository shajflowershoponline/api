"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftAddOnsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const GiftAddOns_1 = require("../../db/entities/GiftAddOns");
const gift_add_ons_service_1 = require("../../services/gift-add-ons.service");
const gift_add_ons_controller_1 = require("./gift-add-ons.controller");
let GiftAddOnsModule = class GiftAddOnsModule {
};
GiftAddOnsModule = __decorate([
    (0, common_1.Module)({
        imports: [firebase_provider_module_1.FirebaseProviderModule, typeorm_1.TypeOrmModule.forFeature([GiftAddOns_1.GiftAddOns])],
        controllers: [gift_add_ons_controller_1.GiftAddOnsController],
        providers: [gift_add_ons_service_1.GiftAddOnsService],
        exports: [gift_add_ons_service_1.GiftAddOnsService],
    })
], GiftAddOnsModule);
exports.GiftAddOnsModule = GiftAddOnsModule;
//# sourceMappingURL=gift-add-ons.module.js.map