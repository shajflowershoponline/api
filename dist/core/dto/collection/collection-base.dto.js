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
exports.DefaultCollectionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const non_negative_dto_1 = require("../non-negative.dto");
class DefaultCollectionDto {
    constructor() {
        this.isSale = false;
        this.productIds = [];
        this.discountTagsIds = [];
        this.isFeatured = false;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultCollectionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultCollectionDto.prototype, "desc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.Validate)(non_negative_dto_1.IsNonNegativeConstraint),
    __metadata("design:type", String)
], DefaultCollectionDto.prototype, "sequenceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DefaultCollectionDto.prototype, "thumbnailFile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DefaultCollectionDto.prototype, "isSale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateIf)((o) => o.isSale === true),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: "Sale from must be a valid date" }),
    __metadata("design:type", Date)
], DefaultCollectionDto.prototype, "saleFromDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateIf)((o) => o.isSale === true),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: "Sale due must be a valid date" }),
    __metadata("design:type", Date)
], DefaultCollectionDto.prototype, "saleDueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], DefaultCollectionDto.prototype, "productIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], DefaultCollectionDto.prototype, "discountTagsIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Object)
], DefaultCollectionDto.prototype, "isFeatured", void 0);
exports.DefaultCollectionDto = DefaultCollectionDto;
//# sourceMappingURL=collection-base.dto.js.map