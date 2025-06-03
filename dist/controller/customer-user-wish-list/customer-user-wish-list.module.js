"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerUserWishListModule = void 0;
const common_1 = require("@nestjs/common");
const customer_user_wish_list_controller_1 = require("./customer-user-wish-list.controller");
const customer_user_wish_list_service_1 = require("../../services/customer-user-wish-list.service");
const CustomerUserWishlist_1 = require("../../db/entities/CustomerUserWishlist");
const typeorm_1 = require("@nestjs/typeorm");
let CustomerUserWishListModule = class CustomerUserWishListModule {
};
CustomerUserWishListModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([CustomerUserWishlist_1.CustomerUserWishlist])],
        controllers: [customer_user_wish_list_controller_1.CustomerUserWishListController],
        providers: [customer_user_wish_list_service_1.CustomerUserWishListService],
        exports: [customer_user_wish_list_service_1.CustomerUserWishListService],
    })
], CustomerUserWishListModule);
exports.CustomerUserWishListModule = CustomerUserWishListModule;
//# sourceMappingURL=customer-user-wish-list.module.js.map