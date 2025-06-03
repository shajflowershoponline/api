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
exports.File = void 0;
const typeorm_1 = require("typeorm");
const Category_1 = require("./Category");
const Collection_1 = require("./Collection");
const Discounts_1 = require("./Discounts");
const GiftAddOns_1 = require("./GiftAddOns");
const Product_1 = require("./Product");
const ProductImage_1 = require("./ProductImage");
let File = class File {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "FileId" }),
    __metadata("design:type", String)
], File.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "FileName" }),
    __metadata("design:type", String)
], File.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "Url", nullable: true }),
    __metadata("design:type", String)
], File.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "GUID" }),
    __metadata("design:type", String)
], File.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Category_1.Category, (category) => category.thumbnailFile),
    __metadata("design:type", Array)
], File.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Collection_1.Collection, (collection) => collection.thumbnailFile),
    __metadata("design:type", Array)
], File.prototype, "collections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Discounts_1.Discounts, (discounts) => discounts.thumbnailFile),
    __metadata("design:type", Array)
], File.prototype, "discounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GiftAddOns_1.GiftAddOns, (giftAddOns) => giftAddOns.thumbnailFile),
    __metadata("design:type", Array)
], File.prototype, "giftAddOns", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product_1.Product, (product) => product.thumbnailFile),
    __metadata("design:type", Array)
], File.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductImage_1.ProductImage, (productImage) => productImage.file),
    __metadata("design:type", Array)
], File.prototype, "productImages", void 0);
File = __decorate([
    (0, typeorm_1.Index)("pk_files_901578250", ["fileId"], { unique: true }),
    (0, typeorm_1.Entity)("File", { schema: "dbo" })
], File);
exports.File = File;
//# sourceMappingURL=File.js.map