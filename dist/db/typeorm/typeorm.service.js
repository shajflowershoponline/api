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
exports.TypeOrmConfigService = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const Category_1 = require("../entities/Category");
const Collection_1 = require("../entities/Collection");
const CustomerUser_1 = require("../entities/CustomerUser");
const Product_1 = require("../entities/Product");
const ProductCollection_1 = require("../entities/ProductCollection");
const StaffAccess_1 = require("../entities/StaffAccess");
const StaffUser_1 = require("../entities/StaffUser");
const File_1 = require("../entities/File");
const ProductImage_1 = require("../entities/ProductImage");
const CustomerUserWishlist_1 = require("../entities/CustomerUserWishlist");
const GiftAddOns_1 = require("../entities/GiftAddOns");
const Discounts_1 = require("../entities/Discounts");
const CartItems_1 = require("../entities/CartItems");
const Order_1 = require("../entities/Order");
const OrderItems_1 = require("../entities/OrderItems");
const CustomerCoupon_1 = require("../entities/CustomerCoupon");
const SystemConfig_1 = require("../entities/SystemConfig");
let TypeOrmConfigService = class TypeOrmConfigService {
    createTypeOrmOptions() {
        const ssl = this.config.get("SSL");
        const config = {
            type: "postgres",
            host: this.config.get("DATABASE_HOST"),
            port: Number(this.config.get("DATABASE_PORT")),
            database: this.config.get("DATABASE_NAME"),
            username: this.config.get("DATABASE_USER"),
            password: this.config.get("DATABASE_PASSWORD"),
            entities: [
                StaffUser_1.StaffUser,
                StaffAccess_1.StaffAccess,
                CustomerUser_1.CustomerUser,
                Product_1.Product,
                ProductImage_1.ProductImage,
                Category_1.Category,
                Collection_1.Collection,
                ProductCollection_1.ProductCollection,
                File_1.File,
                CustomerUserWishlist_1.CustomerUserWishlist,
                GiftAddOns_1.GiftAddOns,
                Discounts_1.Discounts,
                CartItems_1.CartItems,
                Order_1.Order,
                OrderItems_1.OrderItems,
                CustomerCoupon_1.CustomerCoupon,
                SystemConfig_1.SystemConfig
            ],
            synchronize: false,
            ssl: ssl.toLocaleLowerCase().includes("true"),
            extra: {
                timezone: "UTC",
            },
        };
        if (config.ssl) {
            config.extra.ssl = {
                require: true,
                rejectUnauthorized: false,
            };
        }
        return config;
    }
};
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], TypeOrmConfigService.prototype, "config", void 0);
TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)()
], TypeOrmConfigService);
exports.TypeOrmConfigService = TypeOrmConfigService;
//# sourceMappingURL=typeorm.service.js.map