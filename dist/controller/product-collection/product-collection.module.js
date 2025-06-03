"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCollectionModule = void 0;
const common_1 = require("@nestjs/common");
const product_collection_controller_1 = require("./product-collection.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ProductCollection_1 = require("../../db/entities/ProductCollection");
const product_collection_service_1 = require("../../services/product-collection.service");
let ProductCollectionModule = class ProductCollectionModule {
};
ProductCollectionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ProductCollection_1.ProductCollection])],
        controllers: [product_collection_controller_1.ProductCollectionController],
        providers: [product_collection_service_1.ProductCollectionService],
        exports: [product_collection_service_1.ProductCollectionService],
    })
], ProductCollectionModule);
exports.ProductCollectionModule = ProductCollectionModule;
//# sourceMappingURL=product-collection.module.js.map