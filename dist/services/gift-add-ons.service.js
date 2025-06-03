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
exports.GiftAddOnsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const utils_1 = require("../common/utils/utils");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const GiftAddOns_1 = require("../db/entities/GiftAddOns");
const typeorm_2 = require("typeorm");
const File_1 = require("../db/entities/File");
const uuid_1 = require("uuid");
const gift_add_ons_constant_1 = require("../common/constant/gift-add-ons.constant");
let GiftAddOnsService = class GiftAddOnsService {
    constructor(firebaseProvider, giftAddOnRepo) {
        this.firebaseProvider = firebaseProvider;
        this.giftAddOnRepo = giftAddOnRepo;
    }
    async getPagination({ pageSize, pageIndex, order, keywords }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        keywords = keywords ? keywords : "";
        let field = "gift.giftAddOnId";
        let direction = "ASC";
        if (order) {
            const [rawField, rawDirection] = Object.entries(order)[0];
            field = `gift.${(0, utils_1.toCamelCase)(rawField)}`;
            const upperDir = String(rawDirection).toUpperCase();
            direction = upperDir === "ASC" ? "ASC" : "DESC";
        }
        const query = this.giftAddOnRepo
            .createQueryBuilder("gift")
            .leftJoinAndSelect("gift.thumbnailFile", "thumbnailFile")
            .where(`gift."Active" = true`)
            .andWhere(new typeorm_2.Brackets((qb) => {
            qb.where(`gift."Name" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
            }).orWhere(`gift."Description" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
            });
        }))
            .orderBy(field, direction);
        const queryResults = take > 0 ? query.skip(skip).take(take) : query;
        const [results, total] = await Promise.all([
            queryResults.getMany(),
            query.getCount(),
        ]);
        return {
            results,
            total,
        };
    }
    async getById(giftAddOnId) {
        const result = await this.giftAddOnRepo.findOne({
            where: {
                giftAddOnId,
                active: true,
            },
            relations: {
                thumbnailFile: true,
            },
        });
        if (!result) {
            throw Error(gift_add_ons_constant_1.GIFTADDON_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.giftAddOnRepo.manager.transaction(async (entityManager) => {
            try {
                let giftAddOn = new GiftAddOns_1.GiftAddOns();
                giftAddOn.name = dto.name;
                giftAddOn.description = dto.description;
                giftAddOn = await entityManager.save(GiftAddOns_1.GiftAddOns, giftAddOn);
                if (dto.thumbnailFile) {
                    const bucket = this.firebaseProvider.app.storage().bucket();
                    giftAddOn.thumbnailFile = new File_1.File();
                    const newGUID = (0, uuid_1.v4)();
                    const bucketFile = bucket.file(`gift-add-ons/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                    const img = Buffer.from(dto.thumbnailFile.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        giftAddOn.thumbnailFile.guid = newGUID;
                        giftAddOn.thumbnailFile.fileName = dto.thumbnailFile.fileName;
                        giftAddOn.thumbnailFile.url = url[0];
                        giftAddOn.thumbnailFile = await entityManager.save(File_1.File, giftAddOn.thumbnailFile);
                    });
                }
                giftAddOn = await entityManager.save(GiftAddOns_1.GiftAddOns, giftAddOn);
                return await entityManager.findOne(GiftAddOns_1.GiftAddOns, {
                    where: {
                        giftAddOnId: giftAddOn === null || giftAddOn === void 0 ? void 0 : giftAddOn.giftAddOnId,
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
                    throw Error(gift_add_ons_constant_1.GIFTADDON_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async update(giftAddOnId, dto) {
        return await this.giftAddOnRepo.manager.transaction(async (entityManager) => {
            try {
                let giftAddOn = await entityManager.findOne(GiftAddOns_1.GiftAddOns, {
                    where: {
                        giftAddOnId,
                        active: true,
                    },
                    relations: {
                        thumbnailFile: true,
                    },
                });
                if (!giftAddOn) {
                    throw Error(gift_add_ons_constant_1.GIFTADDON_ERROR_NOT_FOUND);
                }
                giftAddOn.name = dto.name;
                giftAddOn.description = dto.description;
                if (dto.thumbnailFile) {
                    const newGUID = (0, uuid_1.v4)();
                    const bucket = this.firebaseProvider.app.storage().bucket();
                    if (giftAddOn.thumbnailFile) {
                        try {
                            const deleteFile = bucket.file(`gift-add-ons/${giftAddOn.thumbnailFile.guid}${(0, path_1.extname)(giftAddOn.thumbnailFile.fileName)}`);
                            const exists = await deleteFile.exists();
                            if (exists[0]) {
                                deleteFile.delete();
                            }
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                        const file = giftAddOn.thumbnailFile;
                        file.guid = newGUID;
                        file.fileName = dto.thumbnailFile.fileName;
                        const bucketFile = bucket.file(`gift-add-ons/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async (res) => {
                            console.log("res");
                            console.log(res);
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            file.url = url[0];
                            giftAddOn.thumbnailFile = await entityManager.save(File_1.File, file);
                        });
                    }
                    else {
                        giftAddOn.thumbnailFile = new File_1.File();
                        giftAddOn.thumbnailFile.guid = newGUID;
                        giftAddOn.thumbnailFile.fileName = dto.thumbnailFile.fileName;
                        const bucketFile = bucket.file(`gift-add-ons/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async () => {
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            giftAddOn.thumbnailFile.url = url[0];
                            giftAddOn.thumbnailFile = await entityManager.save(File_1.File, giftAddOn.thumbnailFile);
                        });
                    }
                }
                giftAddOn = await entityManager.save(GiftAddOns_1.GiftAddOns, giftAddOn);
                return await entityManager.findOne(GiftAddOns_1.GiftAddOns, {
                    where: {
                        giftAddOnId: giftAddOn === null || giftAddOn === void 0 ? void 0 : giftAddOn.giftAddOnId,
                    },
                    relations: {
                        thumbnailFile: true,
                    },
                });
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw Error(gift_add_ons_constant_1.GIFTADDON_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async delete(giftAddOnId) {
        return await this.giftAddOnRepo.manager.transaction(async (entityManager) => {
            const giftAddOn = await entityManager.findOne(GiftAddOns_1.GiftAddOns, {
                where: {
                    giftAddOnId,
                    active: true,
                },
            });
            if (!giftAddOn) {
                throw Error(gift_add_ons_constant_1.GIFTADDON_ERROR_NOT_FOUND);
            }
            giftAddOn.active = false;
            return await entityManager.save(GiftAddOns_1.GiftAddOns, giftAddOn);
        });
    }
};
GiftAddOnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(GiftAddOns_1.GiftAddOns)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], GiftAddOnsService);
exports.GiftAddOnsService = GiftAddOnsService;
//# sourceMappingURL=gift-add-ons.service.js.map