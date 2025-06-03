"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_service_1 = require("./db/typeorm/typeorm.service");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./controller/auth/auth.module");
const Joi = __importStar(require("@hapi/joi"));
const utils_1 = require("./common/utils/utils");
const customer_user_module_1 = require("./controller/customer-user/customer-user.module");
const staff_access_module_1 = require("./controller/staff-access/staff-access.module");
const firebase_provider_module_1 = require("./core/provider/firebase/firebase-provider.module");
const staff_user_module_1 = require("./controller/staff-user/staff-user.module");
const category_module_1 = require("./controller/category/category.module");
const collection_module_1 = require("./controller/collection/collection.module");
const product_module_1 = require("./controller/product/product.module");
const ProductCollection_1 = require("./db/entities/ProductCollection");
const product_collection_module_1 = require("./controller/product-collection/product-collection.module");
const ai_module_1 = require("./controller/ai/ai.module");
const gift_add_ons_module_1 = require("./controller/gift-add-ons/gift-add-ons.module");
const discounts_module_1 = require("./controller/discounts/discounts.module");
const cart_module_1 = require("./controller/cart/cart.module");
const order_module_1 = require("./controller/order/order.module");
const system_config_module_1 = require("./controller/system-config/system-config.module");
const geolocation_module_1 = require("./controller/geolocation/geolocation.module");
const delivery_module_1 = require("./controller/delivery/delivery.module");
const customer_user_wish_list_module_1 = require("./controller/customer-user-wish-list/customer-user-wish-list.module");
const envFilePath = (0, utils_1.getEnvPath)(`${__dirname}/common/envs`);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath,
                isGlobal: true,
                validationSchema: Joi.object({
                    UPLOADED_FILES_DESTINATION: Joi.string().required(),
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({ useClass: typeorm_service_1.TypeOrmConfigService }),
            auth_module_1.AuthModule,
            firebase_provider_module_1.FirebaseProviderModule,
            staff_user_module_1.StaffUserModule,
            staff_access_module_1.StaffAccessModule,
            customer_user_module_1.CustomerUserModule,
            category_module_1.CategoryModule,
            collection_module_1.CollectionModule,
            product_module_1.ProductModule,
            ProductCollection_1.ProductCollection,
            product_collection_module_1.ProductCollectionModule,
            ai_module_1.AIModule,
            gift_add_ons_module_1.GiftAddOnsModule,
            discounts_module_1.DiscountsModule,
            cart_module_1.CartModule,
            order_module_1.OrderModule,
            system_config_module_1.SystemConfigModule,
            geolocation_module_1.GeolocationModule,
            delivery_module_1.DeliveryModule,
            customer_user_wish_list_module_1.CustomerUserWishListModule,
        ],
        providers: [app_service_1.AppService],
        controllers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map