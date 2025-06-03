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
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const File_1 = require("./File");
const Product_1 = require("./Product");
let Category = class Category {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "CategoryId" }),
    __metadata("design:type", String)
], Category.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "SequenceId", default: () => "0" }),
    __metadata("design:type", String)
], Category.prototype, "sequenceId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Desc" }),
    __metadata("design:type", String)
], Category.prototype, "desc", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Category.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => File_1.File, (file) => file.categories),
    (0, typeorm_1.JoinColumn)([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", File_1.File)
], Category.prototype, "thumbnailFile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product_1.Product, (product) => product.category),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
Category = __decorate([
    (0, typeorm_1.Index)("Category_Name_Active_idx", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("Category_SequenceId_Active_idx", ["active", "sequenceId"], {
        unique: true,
    }),
    (0, typeorm_1.Index)("Category_pkey", ["categoryId"], { unique: true }),
    (0, typeorm_1.Entity)("Category", { schema: "dbo" })
], Category);
exports.Category = Category;
//# sourceMappingURL=Category.js.map