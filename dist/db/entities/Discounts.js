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
exports.Discounts = void 0;
const typeorm_1 = require("typeorm");
const CustomerCoupon_1 = require("./CustomerCoupon");
const File_1 = require("./File");
let Discounts = class Discounts {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "DiscountId" }),
    __metadata("design:type", String)
], Discounts.prototype, "discountId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "PromoCode" }),
    __metadata("design:type", String)
], Discounts.prototype, "promoCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description", nullable: true }),
    __metadata("design:type", String)
], Discounts.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Type", default: () => "'AMOUNT'" }),
    __metadata("design:type", String)
], Discounts.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Value", default: () => "0" }),
    __metadata("design:type", String)
], Discounts.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Discounts.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CustomerCoupon_1.CustomerCoupon, (customerCoupon) => customerCoupon.discount),
    __metadata("design:type", Array)
], Discounts.prototype, "customerCoupons", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => File_1.File, (file) => file.discounts),
    (0, typeorm_1.JoinColumn)([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", File_1.File)
], Discounts.prototype, "thumbnailFile", void 0);
Discounts = __decorate([
    (0, typeorm_1.Index)("Discounts_pkey", ["discountId"], { unique: true }),
    (0, typeorm_1.Index)("Discounts_Name_Type_Active_idx", ["promoCode", "type"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("Discounts", { schema: "dbo" })
], Discounts);
exports.Discounts = Discounts;
//# sourceMappingURL=Discounts.js.map