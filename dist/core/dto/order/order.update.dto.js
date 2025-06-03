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
exports.UpdateOrderStatusDto = exports.UpdateStatusEnums = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var UpdateStatusEnums;
(function (UpdateStatusEnums) {
    UpdateStatusEnums["DELIVERY"] = "DELIVERY";
    UpdateStatusEnums["COMPLETED"] = "COMPLETED";
    UpdateStatusEnums["CANCELLED"] = "CANCELLED";
})(UpdateStatusEnums = exports.UpdateStatusEnums || (exports.UpdateStatusEnums = {}));
class UpdateOrderStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: UpdateStatusEnums,
        description: "Status of the order",
        example: UpdateStatusEnums.DELIVERY,
    }),
    (0, class_validator_1.IsEnum)(UpdateStatusEnums),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "status", void 0);
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
//# sourceMappingURL=order.update.dto.js.map