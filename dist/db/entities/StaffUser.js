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
exports.StaffUser = void 0;
const typeorm_1 = require("typeorm");
const StaffAccess_1 = require("./StaffAccess");
let StaffUser = class StaffUser {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "StaffUserId" }),
    __metadata("design:type", String)
], StaffUser.prototype, "staffUserId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "StaffUserCode", nullable: true }),
    __metadata("design:type", String)
], StaffUser.prototype, "staffUserCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "UserName" }),
    __metadata("design:type", String)
], StaffUser.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Password" }),
    __metadata("design:type", String)
], StaffUser.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], StaffUser.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "AccessGranted", nullable: true }),
    __metadata("design:type", Boolean)
], StaffUser.prototype, "accessGranted", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], StaffUser.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => StaffAccess_1.StaffAccess, (staffAccess) => staffAccess.staffUsers),
    (0, typeorm_1.JoinColumn)([
        { name: "StaffAccessId", referencedColumnName: "staffAccessId" },
    ]),
    __metadata("design:type", StaffAccess_1.StaffAccess)
], StaffUser.prototype, "staffAccess", void 0);
StaffUser = __decorate([
    (0, typeorm_1.Index)("StaffUser_UserName_Active_idx", ["active", "userName"], {
        unique: true,
    }),
    (0, typeorm_1.Index)("StaffUser_pkey", ["staffUserId"], { unique: true }),
    (0, typeorm_1.Entity)("StaffUser", { schema: "dbo" })
], StaffUser);
exports.StaffUser = StaffUser;
//# sourceMappingURL=StaffUser.js.map