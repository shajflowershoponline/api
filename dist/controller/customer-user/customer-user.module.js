"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerUserModule = void 0;
const common_1 = require("@nestjs/common");
const customer_user_controller_1 = require("./customer-user.controller");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const CustomerUser_1 = require("../../db/entities/CustomerUser");
const customer_user_service_1 = require("../../services/customer-user.service");
let CustomerUserModule = class CustomerUserModule {
};
CustomerUserModule = __decorate([
    (0, common_1.Module)({
        imports: [firebase_provider_module_1.FirebaseProviderModule, typeorm_1.TypeOrmModule.forFeature([CustomerUser_1.CustomerUser])],
        controllers: [customer_user_controller_1.CustomerUserController],
        providers: [customer_user_service_1.CustomerUserService],
        exports: [customer_user_service_1.CustomerUserService],
    })
], CustomerUserModule);
exports.CustomerUserModule = CustomerUserModule;
//# sourceMappingURL=customer-user.module.js.map