"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIModule = void 0;
const common_1 = require("@nestjs/common");
const ai_controller_1 = require("./ai.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ai_service_1 = require("../../services/ai.service");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const axios_1 = require("@nestjs/axios");
const Product_1 = require("../../db/entities/Product");
const Category_1 = require("../../db/entities/Category");
const Collection_1 = require("../../db/entities/Collection");
const ProductCollection_1 = require("../../db/entities/ProductCollection");
const CartItems_1 = require("../../db/entities/CartItems");
const Order_1 = require("../../db/entities/Order");
const OrderItems_1 = require("../../db/entities/OrderItems");
const CustomerUserWishlist_1 = require("../../db/entities/CustomerUserWishlist");
const product_service_1 = require("../../services/product.service");
const category_service_1 = require("../../services/category.service");
const CustomerUserAiSearch_1 = require("../../db/entities/CustomerUserAiSearch");
let AIModule = class AIModule {
};
AIModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([
                Product_1.Product,
                Category_1.Category,
                Collection_1.Collection,
                ProductCollection_1.ProductCollection,
                CartItems_1.CartItems,
                Order_1.Order,
                OrderItems_1.OrderItems,
                CustomerUserWishlist_1.CustomerUserWishlist,
                CustomerUserAiSearch_1.CustomerUserAiSearch
            ]),
        ],
        controllers: [ai_controller_1.AIController],
        providers: [ai_service_1.AIService, product_service_1.ProductService, category_service_1.CategoryService],
        exports: [ai_service_1.AIService],
    })
], AIModule);
exports.AIModule = AIModule;
//# sourceMappingURL=ai.module.js.map