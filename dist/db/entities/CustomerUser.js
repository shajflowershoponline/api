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
exports.CustomerUser = void 0;
const typeorm_1 = require("typeorm");
const CartItems_1 = require("./CartItems");
const CustomerCoupon_1 = require("./CustomerCoupon");
const CustomerUserWishlist_1 = require("./CustomerUserWishlist");
const Order_1 = require("./Order");
let CustomerUser = class CustomerUser {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "CustomerUserId" }),
    __metadata("design:type", String)
], CustomerUser.prototype, "customerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "CustomerUserCode", nullable: true }),
    __metadata("design:type", String)
], CustomerUser.prototype, "customerUserCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], CustomerUser.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Email" }),
    __metadata("design:type", String)
], CustomerUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Password" }),
    __metadata("design:type", String)
], CustomerUser.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "CurrentOTP", default: () => "0" }),
    __metadata("design:type", String)
], CustomerUser.prototype, "currentOtp", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsVerifiedUser", default: () => "false" }),
    __metadata("design:type", Boolean)
], CustomerUser.prototype, "isVerifiedUser", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], CustomerUser.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "MobileNumber", nullable: true }),
    __metadata("design:type", String)
], CustomerUser.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Address", nullable: true }),
    __metadata("design:type", String)
], CustomerUser.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { name: "AddressCoordinates", nullable: true }),
    __metadata("design:type", Object)
], CustomerUser.prototype, "addressCoordinates", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "AddressLandmark", nullable: true }),
    __metadata("design:type", String)
], CustomerUser.prototype, "addressLandmark", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CartItems_1.CartItems, (cartItems) => cartItems.customerUser),
    __metadata("design:type", Array)
], CustomerUser.prototype, "cartItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CustomerCoupon_1.CustomerCoupon, (customerCoupon) => customerCoupon.customerUser),
    __metadata("design:type", Array)
], CustomerUser.prototype, "customerCoupons", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CustomerUserWishlist_1.CustomerUserWishlist, (customerUserWishlist) => customerUserWishlist.customerUser),
    __metadata("design:type", Array)
], CustomerUser.prototype, "customerUserWishlists", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (order) => order.customerUser),
    __metadata("design:type", Array)
], CustomerUser.prototype, "orders", void 0);
CustomerUser = __decorate([
    (0, typeorm_1.Index)("CustomerUser_Active_Email_idx", ["active", "email"], { unique: true }),
    (0, typeorm_1.Index)("CustomerUser_pkey", ["customerUserId"], { unique: true }),
    (0, typeorm_1.Entity)("CustomerUser", { schema: "dbo" })
], CustomerUser);
exports.CustomerUser = CustomerUser;
//# sourceMappingURL=CustomerUser.js.map