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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const category_constant_1 = require("../common/constant/category.constant");
const utils_1 = require("../common/utils/utils");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const Category_1 = require("../db/entities/Category");
const Product_1 = require("../db/entities/Product");
const typeorm_2 = require("typeorm");
const File_1 = require("../db/entities/File");
const uuid_1 = require("uuid");
let CategoryService = class CategoryService {
    constructor(firebaseProvider, categoryRepo) {
        this.firebaseProvider = firebaseProvider;
        this.categoryRepo = categoryRepo;
    }
    async advancedSearchCategoryIds(query) {
        if (!query)
            return [];
        const keywords = query
            .split(/[^a-zA-Z0-9]+/)
            .filter(Boolean)
            .map((kw) => kw.toLowerCase());
        if (keywords.length === 0)
            return [];
        const conditions = [];
        for (const keyword of keywords) {
            conditions.push(`LOWER(c."Name") LIKE '%${keyword}%' 
      OR LOWER(c."Desc") LIKE '%${keyword}%'`);
        }
        const whereClause = conditions.length > 0 ? `WHERE (${conditions.join(" OR ")})` : "";
        const sql = `
    SELECT DISTINCT c."CategoryId"
    FROM dbo."Category" c
    ${whereClause}
  `;
        const rows = await this.categoryRepo.query(sql);
        return rows.map((row) => row.CategoryId);
    }
    async getPagination({ pageSize, pageIndex, order, keywords }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        keywords = keywords ? keywords : "";
        let field = "category.sequenceId";
        let direction = "ASC";
        if (order) {
            const [rawField, rawDirection] = Object.entries(order)[0];
            field = `category.${(0, utils_1.toCamelCase)(rawField)}`;
            const upperDir = String(rawDirection).toUpperCase();
            direction = upperDir === "ASC" ? "ASC" : "DESC";
        }
        const [results, total, categories] = await Promise.all([
            this.categoryRepo
                .createQueryBuilder("category")
                .leftJoinAndSelect("category.thumbnailFile", "thumbnailFile")
                .where(`category."Active" = true`)
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`category."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                }).orWhere(`category."Desc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .orderBy(field, direction)
                .skip(skip)
                .take(take)
                .getMany(),
            this.categoryRepo
                .createQueryBuilder("category")
                .where(`category."Active" = true`)
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`category."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                }).orWhere(`category."Desc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .getCount(),
            this.categoryRepo
                .createQueryBuilder("category")
                .where(`category."Active" = true`)
                .andWhere(new typeorm_2.Brackets((qb) => {
                qb.where(`category."Name" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                }).orWhere(`category."Desc" ILIKE :keywords`, {
                    keywords: `%${keywords}%`,
                });
            }))
                .getMany()
                .then(async (res) => {
                const categoryIds = res.map((x) => x.categoryId);
                const queryRes = categoryIds.length > 0
                    ? await this.categoryRepo.query(`
            SELECT c."CategoryId" as "categoryId",
            COUNT(p."ProductId")
            FROM dbo."Category" c
            LEFT JOIN dbo."Product" p ON c."CategoryId" = p."CategoryId"
            WHERE p."Active" = true AND c."CategoryId" IN(${categoryIds.join(",")})
            GROUP BY c."CategoryId"`)
                    : [];
                return queryRes;
            }),
        ]);
        return {
            results: results.map((x) => {
                x["productCount"] = categories.some((pc) => x.categoryId.toString() === pc.categoryId.toString())
                    ? categories.find((pc) => x.categoryId.toString() === pc.categoryId.toString()).count
                    : 0;
                return x;
            }),
            total,
        };
    }
    async getById(categoryId) {
        const result = await this.categoryRepo.findOne({
            where: {
                categoryId,
                active: true,
            },
            relations: {
                thumbnailFile: true,
            },
        });
        if (!result) {
            throw Error(category_constant_1.CATEGORY_ERROR_NOT_FOUND);
        }
        const productCount = await this.categoryRepo.manager.count(Product_1.Product, {
            where: {
                category: {
                    categoryId,
                },
            },
        });
        return Object.assign(Object.assign({}, result), { productCount });
    }
    async create(dto) {
        return await this.categoryRepo.manager.transaction(async (entityManager) => {
            try {
                let category = new Category_1.Category();
                category.name = dto.name;
                category.desc = dto.desc;
                category.sequenceId = dto.sequenceId;
                category = await entityManager.save(Category_1.Category, category);
                if (dto.thumbnailFile) {
                    const bucket = this.firebaseProvider.app.storage().bucket();
                    category.thumbnailFile = new File_1.File();
                    const newGUID = (0, uuid_1.v4)();
                    const bucketFile = bucket.file(`category/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                    const img = Buffer.from(dto.thumbnailFile.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        category.thumbnailFile.guid = newGUID;
                        category.thumbnailFile.fileName = dto.thumbnailFile.fileName;
                        category.thumbnailFile.url = url[0];
                        category.thumbnailFile = await entityManager.save(File_1.File, category.thumbnailFile);
                    });
                }
                category = await entityManager.save(Category_1.Category, category);
                return await entityManager.findOne(Category_1.Category, {
                    where: {
                        categoryId: category === null || category === void 0 ? void 0 : category.categoryId,
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
                    throw Error(category_constant_1.CATEGORY_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async update(categoryId, dto) {
        return await this.categoryRepo.manager.transaction(async (entityManager) => {
            try {
                let category = await entityManager.findOne(Category_1.Category, {
                    where: {
                        categoryId,
                        active: true,
                    },
                    relations: {
                        thumbnailFile: true,
                    },
                });
                if (!category) {
                    throw Error(category_constant_1.CATEGORY_ERROR_NOT_FOUND);
                }
                category.name = dto.name;
                category.desc = dto.desc;
                category.sequenceId = dto.sequenceId;
                if (dto.thumbnailFile) {
                    const newGUID = (0, uuid_1.v4)();
                    const bucket = this.firebaseProvider.app.storage().bucket();
                    if (category.thumbnailFile) {
                        try {
                            const deleteFile = bucket.file(`category/${category.thumbnailFile.guid}${(0, path_1.extname)(category.thumbnailFile.fileName)}`);
                            const exists = await deleteFile.exists();
                            if (exists[0]) {
                                deleteFile.delete();
                            }
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                        const file = category.thumbnailFile;
                        file.guid = newGUID;
                        file.fileName = dto.thumbnailFile.fileName;
                        const bucketFile = bucket.file(`category/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async (res) => {
                            console.log("res");
                            console.log(res);
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            file.url = url[0];
                            category.thumbnailFile = await entityManager.save(File_1.File, file);
                        });
                    }
                    else {
                        category.thumbnailFile = new File_1.File();
                        category.thumbnailFile.guid = newGUID;
                        category.thumbnailFile.fileName = dto.thumbnailFile.fileName;
                        const bucketFile = bucket.file(`category/${newGUID}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async () => {
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            category.thumbnailFile.url = url[0];
                            category.thumbnailFile = await entityManager.save(File_1.File, category.thumbnailFile);
                        });
                    }
                }
                category = await entityManager.save(Category_1.Category, category);
                return await entityManager.findOne(Category_1.Category, {
                    where: {
                        categoryId: category === null || category === void 0 ? void 0 : category.categoryId,
                    },
                    relations: {
                        thumbnailFile: true,
                    },
                });
            }
            catch (ex) {
                if (ex.message.includes("duplicate")) {
                    throw Error(category_constant_1.CATEGORY_ERROR_DUPLICATE);
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async updateOrder(dtos) {
        return await this.categoryRepo.manager.transaction(async (entityManager) => {
            try {
                const sequenceMap = new Map(dtos.map((dto) => [dto.categoryId, dto.sequenceId]));
                const categories = await entityManager.find(Category_1.Category, {
                    where: {
                        categoryId: (0, typeorm_2.In)(Array.from(sequenceMap.keys())),
                    },
                });
                if (categories.length !== dtos.length) {
                    throw new Error("Some categories specified in the request were not found.");
                }
                let tempSequence = Math.max(...categories.map((cat) => parseInt(cat.sequenceId))) + 1;
                for (const category of categories) {
                    category.sequenceId = (tempSequence++).toString();
                }
                await entityManager.save(categories);
                for (const category of categories) {
                    const newSequence = sequenceMap.get(category.categoryId);
                    if (newSequence !== undefined) {
                        category.sequenceId = newSequence;
                    }
                }
                await entityManager.save(categories);
                return categories;
            }
            catch (ex) {
                console.error("Error updating order:", ex);
                throw ex;
            }
        });
    }
    async delete(categoryId) {
        return await this.categoryRepo.manager.transaction(async (entityManager) => {
            const category = await entityManager.findOne(Category_1.Category, {
                where: {
                    categoryId,
                    active: true,
                },
            });
            if (!category) {
                throw Error(category_constant_1.CATEGORY_ERROR_NOT_FOUND);
            }
            category.active = false;
            return await entityManager.save(Category_1.Category, category);
        });
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Category_1.Category)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map