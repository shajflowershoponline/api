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
exports.StaffAccess = void 0;
const typeorm_1 = require("typeorm");
const StaffUser_1 = require("./StaffUser");
let StaffAccess = class StaffAccess {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "StaffAccessId" }),
    __metadata("design:type", String)
], StaffAccess.prototype, "staffAccessId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "StaffAccessCode", nullable: true }),
    __metadata("design:type", String)
], StaffAccess.prototype, "staffAccessCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], StaffAccess.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { name: "AccessPages", default: [] }),
    __metadata("design:type", Object)
], StaffAccess.prototype, "accessPages", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], StaffAccess.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StaffUser_1.StaffUser, (staffUser) => staffUser.staffAccess),
    __metadata("design:type", Array)
], StaffAccess.prototype, "staffUsers", void 0);
StaffAccess = __decorate([
    (0, typeorm_1.Index)("StaffAccess_Name_Active_idx", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("StaffAccess_pkey", ["staffAccessId"], { unique: true }),
    (0, typeorm_1.Entity)("StaffAccess", { schema: "dbo" })
], StaffAccess);
exports.StaffAccess = StaffAccess;
//# sourceMappingURL=StaffAccess.js.map