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
exports.DefaultProductDto = exports.ProductImageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const non_negative_dto_1 = require("../non-negative.dto");
class ProductImageDto {
    constructor() {
        this.noChanges = false;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductImageDto.prototype, "guid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductImageDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateIf)((o) => {
        return o.noChanges === true || o.noChanges.toString() === "true";
    }),
    __metadata("design:type", String)
], ProductImageDto.prototype, "base64", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ProductImageDto.prototype, "noChanges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.Validate)(non_negative_dto_1.IsNonNegativeConstraint),
    __metadata("design:type", String)
], ProductImageDto.prototype, "sequenceId", void 0);
exports.ProductImageDto = ProductImageDto;
class DefaultProductDto {
    constructor() {
        this.updateImage = false;
        this.productImages = [];
        this.giftAddOnsAvailable = [];
        this.discountTagsIds = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultProductDto.prototype, "shortDesc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultProductDto.prototype, "longDesc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], DefaultProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultProductDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Size value, must be 1, 2, or 3",
        enum: [1, 2, 3],
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)([1, 2, 3], {
        message: "Size must be one of the following values: 1, 2, or 3",
    }),
    __metadata("design:type", Number)
], DefaultProductDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], DefaultProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Object)
], DefaultProductDto.prototype, "updateImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: ProductImageDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => ProductImageDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], DefaultProductDto.prototype, "productImages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], DefaultProductDto.prototype, "giftAddOnsAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], DefaultProductDto.prototype, "discountTagsIds", void 0);
exports.DefaultProductDto = DefaultProductDto;
//# sourceMappingURL=product-base.dto.js.map