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
exports.ProductImage = void 0;
const typeorm_1 = require("typeorm");
const File_1 = require("./File");
const Product_1 = require("./Product");
let ProductImage = class ProductImage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "ProductImageId" }),
    __metadata("design:type", String)
], ProductImage.prototype, "productImageId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "SequenceId" }),
    __metadata("design:type", String)
], ProductImage.prototype, "sequenceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => File_1.File, (file) => file.productImages),
    (0, typeorm_1.JoinColumn)([{ name: "FileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", File_1.File)
], ProductImage.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.productImages),
    (0, typeorm_1.JoinColumn)([{ name: "ProductId", referencedColumnName: "productId" }]),
    __metadata("design:type", Product_1.Product)
], ProductImage.prototype, "product", void 0);
ProductImage = __decorate([
    (0, typeorm_1.Index)("ProductImage_pkey", ["productImageId"], { unique: true }),
    (0, typeorm_1.Entity)("ProductImage", { schema: "dbo" })
], ProductImage);
exports.ProductImage = ProductImage;
//# sourceMappingURL=ProductImage.js.map