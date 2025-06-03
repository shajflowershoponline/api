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
exports.CustomerCoupon = void 0;
const typeorm_1 = require("typeorm");
const CustomerUser_1 = require("./CustomerUser");
const Discounts_1 = require("./Discounts");
let CustomerCoupon = class CustomerCoupon {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "CustomerCouponId" }),
    __metadata("design:type", String)
], CustomerCoupon.prototype, "customerCouponId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "CreatedDate",
        default: () => "now()",
    }),
    __metadata("design:type", Date)
], CustomerCoupon.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], CustomerCoupon.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CustomerUser_1.CustomerUser, (customerUser) => customerUser.customerCoupons),
    (0, typeorm_1.JoinColumn)([
        { name: "CustomerUserId", referencedColumnName: "customerUserId" },
    ]),
    __metadata("design:type", CustomerUser_1.CustomerUser)
], CustomerCoupon.prototype, "customerUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Discounts_1.Discounts, (discounts) => discounts.customerCoupons),
    (0, typeorm_1.JoinColumn)([{ name: "DiscountId", referencedColumnName: "discountId" }]),
    __metadata("design:type", Discounts_1.Discounts)
], CustomerCoupon.prototype, "discount", void 0);
CustomerCoupon = __decorate([
    (0, typeorm_1.Index)("CustomerCoupon_pkey", ["customerCouponId"], { unique: true }),
    (0, typeorm_1.Entity)("CustomerCoupon", { schema: "dbo" })
], CustomerCoupon);
exports.CustomerCoupon = CustomerCoupon;
//# sourceMappingURL=CustomerCoupon.js.map