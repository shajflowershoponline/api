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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../services/auth.service");
const login_dto_1 = require("../../core/dto/auth/login.dto");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const register_dto_1 = require("../../core/dto/auth/register.dto");
const verify_dto_1 = require("../../core/dto/auth/verify.dto");
const reset_password_dto_1 = require("../../core/dto/auth/reset-password.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async registerClient(dto) {
        const res = {};
        try {
            res.data = await this.authService.registerCustomer(dto);
            res.success = true;
            res.message = `${api_response_constant_1.REGISTER_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async registerVerifyCustomer(dto) {
        const res = {};
        try {
            res.data = await this.authService.registerVerifyCustomer(dto);
            res.success = true;
            res.message = `${api_response_constant_1.VERIFICATION_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async loginStaffUser(dto) {
        const res = {};
        try {
            res.data = await this.authService.getStaffByCredentials(dto);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async loginCustomer(dto) {
        const res = {};
        try {
            res.data = await this.authService.getCustomerByCredentials(dto);
            res.success = true;
            return res;
        }
        catch (e) {
            throw new common_1.HttpException(e.message !== undefined ? e.message : e, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async customerUserResetPassword(dto) {
        const res = {};
        try {
            res.data = await this.authService.customerUserResetPassword(dto);
            res.success = true;
            res.message = `${api_response_constant_1.VERIFICATION_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async customerUserResetPasswordSubmit(dto) {
        const res = {};
        try {
            res.data = await this.authService.customerUserResetPasswordSubmit(dto);
            res.success = true;
            res.message = `Reset password email verification sent!`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async customerUserResetPasswordVerify(dto) {
        const res = {};
        try {
            res.data = await this.authService.customerUserResetPasswordVerify(dto);
            res.success = true;
            res.message = `${api_response_constant_1.VERIFICATION_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
};
__decorate([
    (0, common_1.Post)("register/customer"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterCustomerUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerClient", null);
__decorate([
    (0, common_1.Post)("register/verifyCustomer"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_dto_1.VerifyCustomerUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerVerifyCustomer", null);
__decorate([
    (0, common_1.Post)("login/staff"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.StaffUserLogInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginStaffUser", null);
__decorate([
    (0, common_1.Post)("login/customer"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.CustomerUserLogInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginCustomer", null);
__decorate([
    (0, common_1.Post)("reset/customerUserResetPassword"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.CustomerUserResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "customerUserResetPassword", null);
__decorate([
    (0, common_1.Post)("reset/customerUserResetPasswordSubmit"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.CustomerUserResetPasswordSubmitDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "customerUserResetPasswordSubmit", null);
__decorate([
    (0, common_1.Post)("reset/customerUserVerify"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.CustomerUserResetVerifyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "customerUserResetPasswordVerify", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map