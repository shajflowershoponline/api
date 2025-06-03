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
exports.StaffAccessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const staff_access_constant_1 = require("../common/constant/staff-access.constant");
const utils_1 = require("../common/utils/utils");
const StaffAccess_1 = require("../db/entities/StaffAccess");
const typeorm_2 = require("typeorm");
let StaffAccessService = class StaffAccessService {
    constructor(staffAccessRepo) {
        this.staffAccessRepo = staffAccessRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.staffAccessRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
            }),
            this.staffAccessRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByCode(staffAccessCode) {
        const result = await this.staffAccessRepo.findOne({
            select: {
                staffAccessId: true,
                staffAccessCode: true,
                name: true,
                accessPages: true,
            },
            where: {
                staffAccessCode,
                active: true,
            },
        });
        if (!result) {
            throw Error(staff_access_constant_1.STAFF_ACCESS_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.staffAccessRepo.manager.transaction(async (entityManager) => {
            try {
                let staffAccess = new StaffAccess_1.StaffAccess();
                staffAccess.name = dto.name;
                staffAccess.accessPages = dto.accessPages;
                staffAccess = await entityManager.save(staffAccess);
                staffAccess.staffAccessCode = (0, utils_1.generateIndentityCode)(staffAccess.staffAccessId);
                return await entityManager.save(StaffAccess_1.StaffAccess, staffAccess);
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw new common_1.HttpException(staff_access_constant_1.STAFF_ACCESS_ERROR_DUPLICATE, common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async update(staffAccessCode, dto) {
        return await this.staffAccessRepo.manager.transaction(async (entityManager) => {
            try {
                const staffAccess = await entityManager.findOne(StaffAccess_1.StaffAccess, {
                    where: {
                        staffAccessCode,
                        active: true,
                    },
                });
                if (!staffAccess) {
                    throw Error(staff_access_constant_1.STAFF_ACCESS_ERROR_NOT_FOUND);
                }
                staffAccess.name = dto.name;
                staffAccess.accessPages = dto.accessPages;
                return await entityManager.save(StaffAccess_1.StaffAccess, staffAccess);
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw new common_1.HttpException(staff_access_constant_1.STAFF_ACCESS_ERROR_DUPLICATE, common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async delete(staffAccessCode) {
        return await this.staffAccessRepo.manager.transaction(async (entityManager) => {
            const staffAccess = await entityManager.findOne(StaffAccess_1.StaffAccess, {
                where: {
                    staffAccessCode,
                    active: true,
                },
            });
            if (!staffAccess) {
                throw Error(staff_access_constant_1.STAFF_ACCESS_ERROR_NOT_FOUND);
            }
            staffAccess.active = false;
            return await entityManager.save(StaffAccess_1.StaffAccess, staffAccess);
        });
    }
};
StaffAccessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(StaffAccess_1.StaffAccess)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StaffAccessService);
exports.StaffAccessService = StaffAccessService;
//# sourceMappingURL=staff-access.service.js.map