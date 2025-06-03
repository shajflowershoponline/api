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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const CartItems_1 = require("./CartItems");
const CustomerUserWishlist_1 = require("./CustomerUserWishlist");
const OrderItems_1 = require("./OrderItems");
const Category_1 = require("./Category");
const File_1 = require("./File");
const ProductCollection_1 = require("./ProductCollection");
const ProductImage_1 = require("./ProductImage");
let Product = class Product {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "ProductId" }),
    __metadata("design:type", String)
], Product.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SKU", nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ShortDesc" }),
    __metadata("design:type", String)
], Product.prototype, "shortDesc", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Price", default: () => "0" }),
    __metadata("design:type", String)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "DiscountPrice", default: () => "0" }),
    __metadata("design:type", String)
], Product.prototype, "discountPrice", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Size", default: () => "0" }),
    __metadata("design:type", String)
], Product.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "LongDesc" }),
    __metadata("design:type", String)
], Product.prototype, "longDesc", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Product.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Color", nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "GiftAddOnsAvailable", nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "giftAddOnsAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "DiscountTagsIds", nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "discountTagsIds", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Interested", nullable: true, default: () => "0" }),
    __metadata("design:type", String)
], Product.prototype, "interested", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CartItems_1.CartItems, (cartItems) => cartItems.product),
    __metadata("design:type", Array)
], Product.prototype, "cartItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CustomerUserWishlist_1.CustomerUserWishlist, (customerUserWishlist) => customerUserWishlist.product),
    __metadata("design:type", Array)
], Product.prototype, "customerUserWishlists", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderItems_1.OrderItems, (orderItems) => orderItems.product),
    __metadata("design:type", Array)
], Product.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_1.Category, (category) => category.products),
    (0, typeorm_1.JoinColumn)([{ name: "CategoryId", referencedColumnName: "categoryId" }]),
    __metadata("design:type", Category_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => File_1.File, (file) => file.products),
    (0, typeorm_1.JoinColumn)([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", File_1.File)
], Product.prototype, "thumbnailFile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductCollection_1.ProductCollection, (productCollection) => productCollection.product),
    __metadata("design:type", Array)
], Product.prototype, "productCollections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductImage_1.ProductImage, (productImage) => productImage.product),
    __metadata("design:type", Array)
], Product.prototype, "productImages", void 0);
Product = __decorate([
    (0, typeorm_1.Index)("Product_Name_Active_idx", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("Product_SKU_Active_idx", ["active", "sku"], { unique: true }),
    (0, typeorm_1.Index)("Product_pkey", ["productId"], { unique: true }),
    (0, typeorm_1.Entity)("Product", { schema: "dbo" })
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map