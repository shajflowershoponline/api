"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffUserModule = void 0;
const common_1 = require("@nestjs/common");
const staff_user_controller_1 = require("./staff-user.controller");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const staff_user_service_1 = require("../../services/staff-user.service");
const StaffUser_1 = require("../../db/entities/StaffUser");
let StaffUserModule = class StaffUserModule {
};
StaffUserModule = __decorate([
    (0, common_1.Module)({
        imports: [firebase_provider_module_1.FirebaseProviderModule, typeorm_1.TypeOrmModule.forFeature([StaffUser_1.StaffUser])],
        controllers: [staff_user_controller_1.StaffUserController],
        providers: [staff_user_service_1.StaffUserService],
        exports: [staff_user_service_1.StaffUserService],
    })
], StaffUserModule);
exports.StaffUserModule = StaffUserModule;
//# sourceMappingURL=staff-user.module.js.map