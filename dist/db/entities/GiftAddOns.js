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
exports.GiftAddOns = void 0;
const typeorm_1 = require("typeorm");
const File_1 = require("./File");
let GiftAddOns = class GiftAddOns {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "GiftAddOnId" }),
    __metadata("design:type", String)
], GiftAddOns.prototype, "giftAddOnId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], GiftAddOns.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description", nullable: true }),
    __metadata("design:type", String)
], GiftAddOns.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], GiftAddOns.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => File_1.File, (file) => file.giftAddOns),
    (0, typeorm_1.JoinColumn)([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", File_1.File)
], GiftAddOns.prototype, "thumbnailFile", void 0);
GiftAddOns = __decorate([
    (0, typeorm_1.Index)("GiftAddOns_Name_Active_idx", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("GiftAddOns_pkey", ["giftAddOnId"], { unique: true }),
    (0, typeorm_1.Entity)("GiftAddOns", { schema: "dbo" })
], GiftAddOns);
exports.GiftAddOns = GiftAddOns;
//# sourceMappingURL=GiftAddOns.js.map