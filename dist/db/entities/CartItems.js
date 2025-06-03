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
exports.CartItems = void 0;
const typeorm_1 = require("typeorm");
const CustomerUser_1 = require("./CustomerUser");
const Product_1 = require("./Product");
let CartItems = class CartItems {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "CartItemId" }),
    __metadata("design:type", String)
], CartItems.prototype, "cartItemId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "CreatedAt",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], CartItems.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "UpdatedAt", nullable: true }),
    __metadata("design:type", Date)
], CartItems.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Quantity", default: () => "1" }),
    __metadata("design:type", String)
], CartItems.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Price", default: () => "0" }),
    __metadata("design:type", String)
], CartItems.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], CartItems.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CustomerUser_1.CustomerUser, (customerUser) => customerUser.cartItems),
    (0, typeorm_1.JoinColumn)([
        { name: "CustomerUserId", referencedColumnName: "customerUserId" },
    ]),
    __metadata("design:type", CustomerUser_1.CustomerUser)
], CartItems.prototype, "customerUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.cartItems),
    (0, typeorm_1.JoinColumn)([{ name: "ProductId", referencedColumnName: "productId" }]),
    __metadata("design:type", Product_1.Product)
], CartItems.prototype, "product", void 0);
CartItems = __decorate([
    (0, typeorm_1.Index)("CartItems_pkey", ["cartItemId"], { unique: true }),
    (0, typeorm_1.Entity)("CartItems", { schema: "dbo" })
], CartItems);
exports.CartItems = CartItems;
//# sourceMappingURL=CartItems.js.map