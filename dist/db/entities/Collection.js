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
exports.Collection = void 0;
const typeorm_1 = require("typeorm");
const File_1 = require("./File");
const ProductCollection_1 = require("./ProductCollection");
let Collection = class Collection {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "CollectionId" }),
    __metadata("design:type", String)
], Collection.prototype, "collectionId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "SequenceId", default: () => "0" }),
    __metadata("design:type", String)
], Collection.prototype, "sequenceId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], Collection.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Desc" }),
    __metadata("design:type", String)
], Collection.prototype, "desc", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsSale", default: () => "false" }),
    __metadata("design:type", Boolean)
], Collection.prototype, "isSale", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        name: "SaleFromDate",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Collection.prototype, "saleFromDate", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        name: "SaleDueDate",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Collection.prototype, "saleDueDate", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", nullable: true, default: () => "true" }),
    __metadata("design:type", Boolean)
], Collection.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "DiscountTagsIds", nullable: true }),
    __metadata("design:type", String)
], Collection.prototype, "discountTagsIds", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        name: "IsFeatured",
        nullable: true,
        default: () => "false",
    }),
    __metadata("design:type", Boolean)
], Collection.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => File_1.File, (file) => file.collections),
    (0, typeorm_1.JoinColumn)([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", File_1.File)
], Collection.prototype, "thumbnailFile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductCollection_1.ProductCollection, (productCollection) => productCollection.collection),
    __metadata("design:type", Array)
], Collection.prototype, "productCollections", void 0);
Collection = __decorate([
    (0, typeorm_1.Index)("Collection_pkey", ["collectionId"], { unique: true }),
    (0, typeorm_1.Entity)("Collection", { schema: "dbo" })
], Collection);
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map