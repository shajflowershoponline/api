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
exports.DiscountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const utils_1 = require("../common/utils/utils");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const Discounts_1 = require("../db/entities/Discounts");
const typeorm_2 = require("typeorm");
const File_1 = require("../db/entities/File");
const uuid_1 = require("uuid");
const discounts_constant_1 = require("../common/constant/discounts.constant");
let DiscountsService = class DiscountsService {
    constructor(firebaseProvider, discountRepo) {
        this.firebaseProvider = firebaseProvider;
        this.discountRepo = discountRepo;
    }
    async getPagination({ pageSize, pageIndex, order, keywords }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        let field = "discount.discountId";
        let direction = "ASC";
        if (order) {
            const [rawField, rawDirection] = Object.entries(order)[0];
            field = `discount.${(0, utils_1.toCamelCase)(rawField)}`;
            const upperDir = String(rawDirection).toUpperCase();
            direction = upperDir === "ASC" ? "ASC" : "DESC";
        }
        const [results, total] = await Promise.all([
            this.discountRepo
                .createQueryBuilder("discount")
                .leftJoinAndSelect("discount.thumbnailFile", "thumbnailFile")
                .where(`discount."Active" = true`)
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`discount."PromoCode" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`discount."Description" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`discount."Type" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`CAST(discount."Value" AS TEXT) ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .orderBy(field, direction)
                .skip(skip)
                .take(take)
                .getMany(),
            this.discountRepo
                .createQueryBuilder("discount")
                .where(`discount."Active" = true`)
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`discount."PromoCode" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`discount."Description" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`discount."Type" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                })
                    .orWhere(`CAST(discount."Value" AS TEXT) ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .getCount(),
        ]);
        return {
            results,
            total,
        };
    }
    async getById(discountId) {
        const result = await this.discountRepo.findOne({
            where: {
                discountId,
                active: true,
            },
            relations: {
                thumbnailFile: true,
            },
        });
        if (!result) {
            throw Error(discounts_constant_1.DISCOUNT_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.discountRepo.manager.transaction(async (entityManager) => {
            try {
                let discount = new Discounts_1.Discounts();
                discount.promoCode = dto.promoCode;
                discount.description = dto.description;
                discount.type = dto.type;
                discount.value = dto.value;
                discount = await entityManager.save(Discounts_1.Discounts, discount);
                if (dto.thumbnailFile) {
                    const bucket = this.firebaseProvider.app.storage().bucket();
                    discount.thumbnailFile = new File_1.File();
                    const newGUID = (0, uuid_1.v4)();
                    const bucketFile = bucket.file(`discounts/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                    const img = Buffer.from(dto.thumbnailFile.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        discount.thumbnailFile.guid = newGUID;
                        discount.thumbnailFile.fileName = dto.thumbnailFile.fileName;
                        discount.thumbnailFile.url = url[0];
                        discount.thumbnailFile = await entityManager.save(File_1.File, discount.thumbnailFile);
                    });
                }
                discount = await entityManager.save(Discounts_1.Discounts, discount);
                return await entityManager.findOne(Discounts_1.Discounts, {
                    where: {
                        discountId: discount === null || discount === void 0 ? void 0 : discount.discountId,
                    },
                    relations: {
                        thumbnailFile: true,
                    },
                });
            }
            catch (ex) {
                if (ex.message.toLowerCase().includes("duplicate") &&
                    ex.message.toLowerCase().includes("sequenceid")) {
                    throw Error("Sequence already exist");
                }
                else if (ex.message.toLowerCase().includes("duplicate") &&
                    ex.message.toLowerCase().includes("name")) {
                    throw Error(discounts_constant_1.DISCOUNT_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async update(discountId, dto) {
        return await this.discountRepo.manager.transaction(async (entityManager) => {
            try {
                let discount = await entityManager.findOne(Discounts_1.Discounts, {
                    where: {
                        discountId,
                        active: true,
                    },
                    relations: {
                        thumbnailFile: true,
                    },
                });
                if (!discount) {
                    throw Error(discounts_constant_1.DISCOUNT_ERROR_NOT_FOUND);
                }
                discount.promoCode = dto.promoCode;
                discount.description = dto.description;
                discount.type = dto.type;
                discount.value = dto.value;
                if (dto.thumbnailFile) {
                    const newGUID = (0, uuid_1.v4)();
                    const bucket = this.firebaseProvider.app.storage().bucket();
                    if (discount.thumbnailFile) {
                        try {
                            const deleteFile = bucket.file(`discounts/${discount.thumbnailFile.guid}${(0, path_1.extname)(discount.thumbnailFile.fileName)}`);
                            const exists = await deleteFile.exists();
                            if (exists[0]) {
                                deleteFile.delete();
                            }
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                        const file = discount.thumbnailFile;
                        file.guid = newGUID;
                        file.fileName = dto.thumbnailFile.fileName;
                        const bucketFile = bucket.file(`discounts/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async (res) => {
                            console.log("res");
                            console.log(res);
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            file.url = url[0];
                            discount.thumbnailFile = await entityManager.save(File_1.File, file);
                        });
                    }
                    else {
                        discount.thumbnailFile = new File_1.File();
                        discount.thumbnailFile.guid = newGUID;
                        discount.thumbnailFile.fileName = dto.thumbnailFile.fileName;
                        const bucketFile = bucket.file(`discounts/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async () => {
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            discount.thumbnailFile.url = url[0];
                            discount.thumbnailFile = await entityManager.save(File_1.File, discount.thumbnailFile);
                        });
                    }
                }
                discount = await entityManager.save(Discounts_1.Discounts, discount);
                return await entityManager.findOne(Discounts_1.Discounts, {
                    where: {
                        discountId: discount === null || discount === void 0 ? void 0 : discount.discountId,
                    },
                    relations: {
                        thumbnailFile: true,
                    },
                });
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw Error(discounts_constant_1.DISCOUNT_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async delete(discountId) {
        return await this.discountRepo.manager.transaction(async (entityManager) => {
            const discount = await entityManager.findOne(Discounts_1.Discounts, {
                where: {
                    discountId,
                    active: true,
                },
            });
            if (!discount) {
                throw Error(discounts_constant_1.DISCOUNT_ERROR_NOT_FOUND);
            }
            discount.active = false;
            return await entityManager.save(Discounts_1.Discounts, discount);
        });
    }
};
DiscountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Discounts_1.Discounts)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], DiscountsService);
exports.DiscountsService = DiscountsService;
//# sourceMappingURL=discounts.service.js.map