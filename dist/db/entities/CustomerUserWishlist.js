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
exports.CustomerUserWishlist = void 0;
const typeorm_1 = require("typeorm");
const CustomerUser_1 = require("./CustomerUser");
const Product_1 = require("./Product");
let CustomerUserWishlist = class CustomerUserWishlist {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "CustomerUserWishlistId" }),
    __metadata("design:type", String)
], CustomerUserWishlist.prototype, "customerUserWishlistId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "CustomerUserId" }),
    __metadata("design:type", String)
], CustomerUserWishlist.prototype, "customerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "ProductId" }),
    __metadata("design:type", String)
], CustomerUserWishlist.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", { name: "DateTime" }),
    __metadata("design:type", Date)
], CustomerUserWishlist.prototype, "dateTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CustomerUser_1.CustomerUser, (customerUser) => customerUser.customerUserWishlists),
    (0, typeorm_1.JoinColumn)([
        { name: "CustomerUserId", referencedColumnName: "customerUserId" },
    ]),
    __metadata("design:type", CustomerUser_1.CustomerUser)
], CustomerUserWishlist.prototype, "customerUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.customerUserWishlists),
    (0, typeorm_1.JoinColumn)([{ name: "ProductId", referencedColumnName: "productId" }]),
    __metadata("design:type", Product_1.Product)
], CustomerUserWishlist.prototype, "product", void 0);
CustomerUserWishlist = __decorate([
    (0, typeorm_1.Index)("CustomerUserWishlist_CustomerUserId_ProductId_idx", ["customerUserId", "productId"], { unique: true }),
    (0, typeorm_1.Index)("CustomerUserWishlist_pkey", ["customerUserWishlistId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("CustomerUserWishlist", { schema: "dbo" })
], CustomerUserWishlist);
exports.CustomerUserWishlist = CustomerUserWishlist;
//# sourceMappingURL=CustomerUserWishlist.js.map