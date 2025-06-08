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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const SystemConfig_1 = require("../db/entities/SystemConfig");
const typeorm_2 = require("typeorm");
const File_1 = require("../db/entities/File");
const uuid_1 = require("uuid");
const path_1 = require("path");
const moment_1 = __importDefault(require("moment"));
let SystemConfigService = class SystemConfigService {
    constructor(firebaseProvider, systemConfigRepo, config) {
        this.firebaseProvider = firebaseProvider;
        this.systemConfigRepo = systemConfigRepo;
        this.config = config;
    }
    async getAll() {
        const results = await this.systemConfigRepo.find();
        const keys = [
            "MAXIM_LOCATION_SERVICE_URL",
            "MAXIM_LOCATION_SERVICE_API_KEY",
        ];
        const values = keys.map((key) => {
            return {
                key,
                value: this.config.get(key),
            };
        });
        return [...results, ...values];
    }
    async save({ key, value }) {
        return await this.systemConfigRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c;
            const systemConfig = await entityManager.findOne(SystemConfig_1.SystemConfig, {
                where: { key },
            });
            if (!systemConfig) {
                throw new Error("No system config found");
            }
            const bucket = this.firebaseProvider.app.storage().bucket();
            if (key === "CLIENT_SITE_SLIDES_CONTENTS") {
                for (const i of ["1", "2"]) {
                    if (value[i].image &&
                        value[i].image.includes("base64") &&
                        value[i].image.split(",").length > 0 &&
                        (!value[i].fileId || value[i].fileId === "")) {
                        let file = new File_1.File();
                        const fileName = (_a = value[i].fileName) !== null && _a !== void 0 ? _a : `${(0, moment_1.default)().format("YYYY-MM-DD_HH-mm")}`;
                        const newGUID = (0, uuid_1.v4)();
                        const bucketFile = bucket.file(`slides/${newGUID}${(0, path_1.extname)(fileName)}`);
                        const img = Buffer.from(value[i].image.split(",")[1], "base64");
                        await bucketFile.save(img).then(async () => {
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            file.guid = newGUID;
                            file.fileName = fileName;
                            file.url = url[0];
                            file = await entityManager.save(File_1.File, file);
                            value[i].fileId = file.fileId;
                            value[i].image = file.url;
                        });
                    }
                    else if (value[i].image &&
                        value[i].image.includes("base64") &&
                        value[i].image.split(",").length > 0) {
                        let file = await entityManager.findOne(File_1.File, {
                            where: {
                                fileId: value[i].fileId,
                            },
                        });
                        if (file) {
                            try {
                                const deleteFile = bucket.file(`slides/${file.guid}${(0, path_1.extname)(file.fileName)}`);
                                const exists = await deleteFile.exists();
                                if (exists[0]) {
                                    deleteFile.delete();
                                }
                            }
                            catch (ex) {
                                console.log(ex);
                            }
                            const newGUID = (0, uuid_1.v4)();
                            const fileName = (_b = value[i].fileName) !== null && _b !== void 0 ? _b : `${(0, moment_1.default)().format("YYYY-MM-DD_HH-mm")}`;
                            file.fileName = fileName;
                            file.guid = newGUID;
                            const bucketFile = bucket.file(`slides/${newGUID}${(0, path_1.extname)(fileName)}`);
                            const img = Buffer.from(value[i].image.split(",")[1], "base64");
                            await bucketFile.save(img).then(async (res) => {
                                console.log("res");
                                console.log(res);
                                const url = await bucketFile.getSignedUrl({
                                    action: "read",
                                    expires: "03-09-2500",
                                });
                                file.url = url[0];
                                file = await entityManager.save(File_1.File, file);
                                value[i].fileId = file.fileId;
                                value[i].image = file.url;
                            });
                        }
                        else {
                            const fileName = (_c = value[i].fileName) !== null && _c !== void 0 ? _c : `${(0, moment_1.default)().format("YYYY-MM-DD_HH-mm")}`;
                            const newGUID = (0, uuid_1.v4)();
                            file = new File_1.File();
                            file.fileName = fileName;
                            file.guid = newGUID;
                            const bucketFile = bucket.file(`slides/${newGUID}${(0, path_1.extname)(fileName)}`);
                            const img = Buffer.from(value[i].image.split(",")[1], "base64");
                            await bucketFile.save(img).then(async (res) => {
                                console.log("res");
                                console.log(res);
                                const url = await bucketFile.getSignedUrl({
                                    action: "read",
                                    expires: "03-09-2500",
                                });
                                file.url = url[0];
                                file = await entityManager.save(File_1.File, file);
                                value[i].fileId = file.fileId;
                                value[i].image = file.url;
                            });
                        }
                    }
                }
            }
            systemConfig.value = value;
            await entityManager.save(SystemConfig_1.SystemConfig, systemConfig);
            return await entityManager.find(SystemConfig_1.SystemConfig);
        });
    }
};
SystemConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(SystemConfig_1.SystemConfig)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository,
        config_1.ConfigService])
], SystemConfigService);
exports.SystemConfigService = SystemConfigService;
//# sourceMappingURL=system-config.service.js.map