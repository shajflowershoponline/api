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
exports.ProductCollection = void 0;
const typeorm_1 = require("typeorm");
const Collection_1 = require("./Collection");
const Product_1 = require("./Product");
let ProductCollection = class ProductCollection {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "ProductCollectionId" }),
    __metadata("design:type", String)
], ProductCollection.prototype, "productCollectionId", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], ProductCollection.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Collection_1.Collection, (collection) => collection.productCollections),
    (0, typeorm_1.JoinColumn)([{ name: "CollectionId", referencedColumnName: "collectionId" }]),
    __metadata("design:type", Collection_1.Collection)
], ProductCollection.prototype, "collection", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.productCollections),
    (0, typeorm_1.JoinColumn)([{ name: "ProductId", referencedColumnName: "productId" }]),
    __metadata("design:type", Product_1.Product)
], ProductCollection.prototype, "product", void 0);
ProductCollection = __decorate([
    (0, typeorm_1.Index)("ProductCollection_pkey", ["productCollectionId"], { unique: true }),
    (0, typeorm_1.Entity)("ProductCollection", { schema: "dbo" })
], ProductCollection);
exports.ProductCollection = ProductCollection;
//# sourceMappingURL=ProductCollection.js.map