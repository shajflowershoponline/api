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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../common/utils/utils");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_error_constant_1 = require("../common/constant/auth-error.constant");
const email_service_1 = require("./email.service");
const CustomerUser_1 = require("../db/entities/CustomerUser");
const StaffUser_1 = require("../db/entities/StaffUser");
let AuthService = class AuthService {
    constructor(customerUserRepo, staffUserRepo, emailService) {
        this.customerUserRepo = customerUserRepo;
        this.staffUserRepo = staffUserRepo;
        this.emailService = emailService;
    }
    async registerCustomer(dto) {
        try {
            return await this.customerUserRepo.manager.transaction(async (transactionalEntityManager) => {
                let customerUser = await transactionalEntityManager.findOneBy(CustomerUser_1.CustomerUser, {
                    email: dto.email
                });
                if (!customerUser) {
                    customerUser = new CustomerUser_1.CustomerUser();
                }
                else if (customerUser && customerUser.isVerifiedUser) {
                    throw Error("Email already used!");
                }
                customerUser.email = dto.email;
                customerUser.password = await (0, utils_1.hash)(dto.password);
                customerUser.name = dto.name;
                customerUser.email = dto.email;
                customerUser.currentOtp = (0, utils_1.generateOTP)();
                customerUser = await transactionalEntityManager.save(CustomerUser_1.CustomerUser, customerUser);
                const sendEmailResult = await this.emailService.sendEmailVerification(dto.email, customerUser.customerUserCode, customerUser.currentOtp);
                if (!sendEmailResult) {
                    throw new Error("Error sending email verification!");
                }
                customerUser.customerUserCode = (0, utils_1.generateIndentityCode)(customerUser.customerUserId);
                customerUser = await transactionalEntityManager.save(CustomerUser_1.CustomerUser, customerUser);
                delete customerUser.password;
                return customerUser;
            });
        }
        catch (ex) {
            if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_username")) {
                throw Error("Email already used!");
            }
            else {
                throw ex;
            }
        }
    }
    async registerVerifyCustomer(dto) {
        try {
            return await this.customerUserRepo.manager.transaction(async (transactionalEntityManager) => {
                let customerUser = await transactionalEntityManager.findOneBy(CustomerUser_1.CustomerUser, {
                    email: dto.email,
                });
                if (!customerUser) {
                    throw Error("Email not found!");
                }
                else if (customerUser && customerUser.isVerifiedUser) {
                    throw Error("Email already verified!");
                }
                else if (customerUser && customerUser.currentOtp.toString().trim() !== dto.otp.toString().trim()) {
                    throw Error("Invalid code!");
                }
                customerUser.isVerifiedUser = true;
                customerUser = await transactionalEntityManager.save(CustomerUser_1.CustomerUser, customerUser);
                delete customerUser.password;
                return customerUser;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async getStaffByCredentials({ userName, password }) {
        try {
            let staffUser = await this.staffUserRepo.findOne({
                where: {
                    userName,
                    active: true,
                },
                relations: {
                    staffAccess: true
                }
            });
            if (!staffUser) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
            }
            const passwordMatch = await (0, utils_1.compare)(staffUser.password, password);
            if (!passwordMatch) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PASSWORD_INCORRECT);
            }
            if (!staffUser.accessGranted) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PENDING_ACCESS_REQUEST);
            }
            delete staffUser.password;
            return staffUser;
        }
        catch (ex) {
            throw ex;
        }
    }
    async getCustomerByCredentials({ email, password }) {
        try {
            let customerUser = await this.customerUserRepo.findOne({
                where: {
                    email,
                    active: true
                },
                relations: {}
            });
            if (!customerUser) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
            }
            const passwordMatch = await (0, utils_1.compare)(customerUser.password, password);
            if (!passwordMatch) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PASSWORD_INCORRECT);
            }
            delete customerUser.password;
            return customerUser;
        }
        catch (ex) {
            throw ex;
        }
    }
    async verifyCustomerUser(customerUserCode, hash) {
        try {
            return await this.customerUserRepo.manager.transaction(async (entityManager) => {
                let customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                    where: {
                        customerUserCode
                    }
                });
                if (!customerUser) {
                    throw Error("Invalid user code");
                }
                if (customerUser.isVerifiedUser) {
                    throw Error("User was already verified!");
                }
                const match = await (0, utils_1.compare)(hash, customerUser.currentOtp);
                if (!match) {
                    throw Error("Invalid code");
                }
                customerUser.isVerifiedUser = true;
                customerUser = await entityManager.save(CustomerUser_1.CustomerUser, customerUser);
                delete customerUser.password;
                return true;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async customerUserResetPasswordSubmit(dto) {
        try {
            return await this.customerUserRepo.manager.transaction(async (entityManager) => {
                let customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                    where: {
                        email: dto.email
                    }
                });
                if (!customerUser) {
                    throw Error("Email not found!");
                }
                if (!customerUser.isVerifiedUser) {
                    throw Error("User was not yet verified!");
                }
                customerUser.currentOtp = (0, utils_1.generateOTP)();
                customerUser = await entityManager.save(CustomerUser_1.CustomerUser, customerUser);
                const sendEmailResult = await this.emailService.sendResetPasswordOtp(dto.email, customerUser.customerUserCode, customerUser.currentOtp);
                if (!sendEmailResult) {
                    throw new Error("Error sending email verification!");
                }
                delete customerUser.password;
                return true;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async customerUserResetPasswordVerify(dto) {
        try {
            return await this.customerUserRepo.manager.transaction(async (entityManager) => {
                let customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                    where: {
                        email: dto.email
                    }
                });
                if (!customerUser) {
                    throw Error("Email not found!");
                }
                if (!customerUser.isVerifiedUser) {
                    throw Error("User was not yet verified!");
                }
                const match = customerUser.currentOtp === dto.otp;
                if (!match) {
                    throw Error("Invalid code");
                }
                return true;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async customerUserResetPassword(dto) {
        try {
            return await this.customerUserRepo.manager.transaction(async (entityManager) => {
                let customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                    where: {
                        email: dto.email
                    }
                });
                if (!customerUser) {
                    throw Error("Email not found!");
                }
                if (!customerUser.isVerifiedUser) {
                    throw Error("User was not yet verified!");
                }
                const match = customerUser.currentOtp === dto.otp;
                if (!match) {
                    throw Error("Invalid code");
                }
                customerUser.password = await (0, utils_1.hash)(dto.password);
                customerUser = await entityManager.save(CustomerUser_1.CustomerUser, customerUser);
                delete customerUser.password;
                return customerUser;
            });
        }
        catch (ex) {
            throw ex;
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(CustomerUser_1.CustomerUser)),
    __param(1, (0, typeorm_1.InjectRepository)(StaffUser_1.StaffUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map