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
exports.CustomerUserService = void 0;
const utils_1 = require("../common/utils/utils");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_user_error_constant_1 = require("../common/constant/customer-user-error.constant");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const CustomerUser_1 = require("../db/entities/CustomerUser");
const typeorm_2 = require("typeorm");
let CustomerUserService = class CustomerUserService {
    constructor(firebaseProvoder, customerUserRepo) {
        this.firebaseProvoder = firebaseProvoder;
        this.customerUserRepo = customerUserRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.customerUserRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                relations: {},
                skip,
                take,
                order,
            }),
            this.customerUserRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results: results.map((x) => {
                delete x.password;
                return x;
            }),
            total,
        };
    }
    async getByCode(customerUserCode) {
        const res = await this.customerUserRepo.findOne({
            where: {
                customerUserCode,
                active: true,
            },
            relations: {},
        });
        if (!res) {
            throw Error(customer_user_error_constant_1.CUSTOMER_USER_ERROR_USER_NOT_FOUND);
        }
        if (res.password)
            delete res.password;
        return res;
    }
    async create(dto) {
        return await this.customerUserRepo.manager.transaction(async (entityManager) => {
            var _a;
            try {
                let customerUser = new CustomerUser_1.CustomerUser();
                customerUser.email = dto.email;
                customerUser.password = await (0, utils_1.hash)(dto.password);
                customerUser.name = (_a = dto.name) !== null && _a !== void 0 ? _a : "";
                customerUser.email = dto.email;
                customerUser.currentOtp = "0";
                customerUser.isVerifiedUser = true;
                customerUser = await entityManager.save(CustomerUser_1.CustomerUser, customerUser);
                customerUser.customerUserCode = (0, utils_1.generateIndentityCode)(customerUser.customerUserId);
                customerUser = await entityManager.save(CustomerUser_1.CustomerUser, customerUser);
                customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                    where: {
                        customerUserCode: customerUser.customerUserCode,
                        active: true,
                    },
                    relations: {},
                });
                delete customerUser.password;
                return customerUser;
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw new common_1.HttpException(customer_user_error_constant_1.CUSTOMER_USER_ERROR_USER_DUPLICATE, common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async updateProfile(customerUserCode, dto) {
        return await this.customerUserRepo.manager.transaction(async (entityManager) => {
            var _a;
            let customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                where: {
                    customerUserCode,
                    active: true,
                },
                relations: {},
            });
            if (!customerUser) {
                throw Error(customer_user_error_constant_1.CUSTOMER_USER_ERROR_USER_NOT_FOUND);
            }
            customerUser.name = (_a = dto.name) !== null && _a !== void 0 ? _a : "";
            customerUser.email = dto.email;
            customerUser.mobileNumber = dto.mobileNumber;
            customerUser.address = dto.address;
            customerUser.addressLandmark = dto.addressLandmark;
            customerUser.addressCoordinates = dto.addressCoordinates;
            customerUser = await entityManager.save(CustomerUser_1.CustomerUser, customerUser);
            customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                where: {
                    customerUserCode,
                    active: true,
                },
                relations: {},
            });
            delete customerUser.password;
            return customerUser;
        });
    }
    async update(customerUserCode, dto) {
        return await this.customerUserRepo.manager.transaction(async (entityManager) => {
            try {
                let customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                    where: {
                        customerUserCode,
                        active: true,
                    },
                    relations: {},
                });
                if (!customerUser) {
                    throw Error(customer_user_error_constant_1.CUSTOMER_USER_ERROR_USER_NOT_FOUND);
                }
                customerUser.name = dto.name;
                customerUser.email = dto.email;
                customerUser = await entityManager.save(CustomerUser_1.CustomerUser, customerUser);
                customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                    where: {
                        customerUserCode,
                        active: true,
                    },
                    relations: {},
                });
                delete customerUser.password;
                return customerUser;
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw new common_1.HttpException(customer_user_error_constant_1.CUSTOMER_USER_ERROR_USER_DUPLICATE, common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async delete(customerUserCode) {
        return await this.customerUserRepo.manager.transaction(async (entityManager) => {
            let customerUser = await entityManager.findOne(CustomerUser_1.CustomerUser, {
                where: {
                    customerUserCode,
                    active: true,
                },
                relations: {},
            });
            if (!customerUser) {
                throw Error(customer_user_error_constant_1.CUSTOMER_USER_ERROR_USER_NOT_FOUND);
            }
            customerUser.active = false;
            customerUser = await entityManager.save(CustomerUser_1.CustomerUser, customerUser);
            delete customerUser.password;
            return customerUser;
        });
    }
};
CustomerUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(CustomerUser_1.CustomerUser)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], CustomerUserService);
exports.CustomerUserService = CustomerUserService;
//# sourceMappingURL=customer-user.service.js.map