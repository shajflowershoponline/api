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
exports.StaffUserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const staff_access_constant_1 = require("../common/constant/staff-access.constant");
const utils_1 = require("../common/utils/utils");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const StaffAccess_1 = require("../db/entities/StaffAccess");
const StaffUser_1 = require("../db/entities/StaffUser");
const typeorm_2 = require("typeorm");
const staff_user_error_constant_1 = require("../common/constant/staff-user-error.constant");
let StaffUserService = class StaffUserService {
    constructor(firebaseProvoder, staffUserRepo) {
        this.firebaseProvoder = firebaseProvoder;
        this.staffUserRepo = staffUserRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.staffUserRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                relations: {},
                skip,
                take,
                order,
            }),
            this.staffUserRepo.count({
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
    async getByCode(staffUserCode) {
        const res = await this.staffUserRepo.findOne({
            where: {
                staffUserCode,
                active: true,
            },
            relations: {
                staffAccess: true,
            },
        });
        if (!res) {
            throw Error(staff_user_error_constant_1.STAFF_USER_ERROR_USER_NOT_FOUND);
        }
        if (res.password)
            delete res.password;
        return res;
    }
    async create(dto) {
        return await this.staffUserRepo.manager.transaction(async (entityManager) => {
            var _a;
            try {
                let staffUser = new StaffUser_1.StaffUser();
                staffUser.userName = dto.userName;
                staffUser.password = await (0, utils_1.hash)(dto.password);
                staffUser.name = (_a = dto.name) !== null && _a !== void 0 ? _a : "";
                if (dto.staffAccessCode) {
                    const access = await entityManager.findOne(StaffAccess_1.StaffAccess, {
                        where: {
                            staffAccessCode: dto.staffAccessCode,
                            active: true,
                        },
                    });
                    if (!access) {
                        throw Error(staff_access_constant_1.STAFF_ACCESS_ERROR_NOT_FOUND);
                    }
                    staffUser.staffAccess = access;
                }
                staffUser.accessGranted = true;
                staffUser = await entityManager.save(StaffUser_1.StaffUser, staffUser);
                staffUser.staffUserCode = (0, utils_1.generateIndentityCode)(staffUser.staffUserId);
                staffUser = await entityManager.save(StaffUser_1.StaffUser, staffUser);
                staffUser = await entityManager.findOne(StaffUser_1.StaffUser, {
                    where: {
                        staffUserCode: staffUser.staffUserCode,
                        active: true,
                    },
                    relations: {},
                });
                delete staffUser.password;
                return staffUser;
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw new common_1.HttpException(staff_user_error_constant_1.STAFF_USER_ERROR_USER_DUPLICATE, common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async updateProfile(staffUserCode, dto) {
        return await this.staffUserRepo.manager.transaction(async (entityManager) => {
            var _a;
            let staffUser = await entityManager.findOne(StaffUser_1.StaffUser, {
                where: {
                    staffUserCode,
                    active: true,
                },
                relations: {},
            });
            if (!staffUser) {
                throw Error(staff_user_error_constant_1.STAFF_USER_ERROR_USER_NOT_FOUND);
            }
            staffUser.accessGranted = true;
            staffUser.name = (_a = dto.name) !== null && _a !== void 0 ? _a : "";
            staffUser = await entityManager.save(StaffUser_1.StaffUser, staffUser);
            staffUser = await entityManager.findOne(StaffUser_1.StaffUser, {
                where: {
                    staffUserCode,
                    active: true,
                },
                relations: {},
            });
            delete staffUser.password;
            return staffUser;
        });
    }
    async update(staffUserCode, dto) {
        return await this.staffUserRepo.manager.transaction(async (entityManager) => {
            try {
                let staffUser = await entityManager.findOne(StaffUser_1.StaffUser, {
                    where: {
                        staffUserCode,
                        active: true,
                    },
                    relations: {},
                });
                if (!staffUser) {
                    throw Error(staff_user_error_constant_1.STAFF_USER_ERROR_USER_NOT_FOUND);
                }
                staffUser.name = dto.name;
                if (dto.staffAccessCode) {
                    const staffAccess = await entityManager.findOne(StaffAccess_1.StaffAccess, {
                        where: {
                            staffAccessCode: dto.staffAccessCode,
                            active: true,
                        },
                    });
                    if (!staffAccess) {
                        throw Error(staff_access_constant_1.STAFF_ACCESS_ERROR_NOT_FOUND);
                    }
                    staffUser.staffAccess = staffAccess;
                }
                staffUser.accessGranted = true;
                staffUser = await entityManager.save(StaffUser_1.StaffUser, staffUser);
                staffUser = await entityManager.findOne(StaffUser_1.StaffUser, {
                    where: {
                        staffUserCode,
                        active: true,
                    },
                    relations: {},
                });
                delete staffUser.password;
                return staffUser;
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw new common_1.HttpException(staff_user_error_constant_1.STAFF_USER_ERROR_USER_DUPLICATE, common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async delete(staffUserCode) {
        return await this.staffUserRepo.manager.transaction(async (entityManager) => {
            let staffUser = await entityManager.findOne(StaffUser_1.StaffUser, {
                where: {
                    staffUserCode,
                    active: true,
                },
                relations: {},
            });
            if (!staffUser) {
                throw Error(staff_user_error_constant_1.STAFF_USER_ERROR_USER_NOT_FOUND);
            }
            staffUser.active = false;
            staffUser = await entityManager.save(StaffUser_1.StaffUser, staffUser);
            delete staffUser.password;
            return staffUser;
        });
    }
};
StaffUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(StaffUser_1.StaffUser)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], StaffUserService);
exports.StaffUserService = StaffUserService;
//# sourceMappingURL=staff-user.service.js.map