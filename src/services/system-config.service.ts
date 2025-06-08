import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { Repository } from "typeorm";
import { File } from "src/db/entities/File";
import { v4 as uuid } from "uuid";
import { extname } from "path";
import moment from "moment";

@Injectable()
export class SystemConfigService {
  constructor(
    private firebaseProvider: FirebaseProvider,
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepo: Repository<SystemConfig>,
    private readonly config: ConfigService
  ) {}

  async getAll() {
    const results = await this.systemConfigRepo.find();

    const keys = [
      "MAXIM_LOCATION_SERVICE_URL",
      "MAXIM_LOCATION_SERVICE_API_KEY",
    ];
    const values = keys.map((key) => {
      return {
        key,
        value: this.config.get<string>(key),
      };
    });
    return [...results, ...values];
  }
  async save({ key, value }) {
    return await this.systemConfigRepo.manager.transaction(
      async (entityManager) => {
        const systemConfig = await entityManager.findOne(SystemConfig, {
          where: { key },
        });

        if (!systemConfig) {
          throw new Error("No system config found");
        }
        const bucket = this.firebaseProvider.app.storage().bucket();

        if (key === "CLIENT_SITE_SLIDES_CONTENTS") {
          for (const i of ["1", "2"]) {
            if (
              value[i].image &&
              value[i].image.includes("base64") &&
              value[i].image.split(",").length > 0 &&
              (!value[i].fileId || value[i].fileId === "")
            ) {
              let file = new File();
              const fileName =
                value[i].fileName ?? `${moment().format("YYYY-MM-DD_HH-mm")}`;
              const newGUID: string = uuid();
              const bucketFile = bucket.file(
                `slides/${newGUID}${extname(fileName)}`
              );
              const img = Buffer.from(value[i].image.split(",")[1], "base64");
              await bucketFile.save(img).then(async () => {
                const url = await bucketFile.getSignedUrl({
                  action: "read",
                  expires: "03-09-2500",
                });
                file.guid = newGUID;
                file.fileName = fileName;
                file.url = url[0];
                file = await entityManager.save(File, file);
                value[i].fileId = file.fileId;
                value[i].image = file.url;
              });
            } else if (
              value[i].image &&
              value[i].image.includes("base64") &&
              value[i].image.split(",").length > 0
            ) {
              let file = await entityManager.findOne(File, {
                where: {
                  fileId: value[i].fileId,
                },
              });
              if (file) {
                try {
                  const deleteFile = bucket.file(
                    `slides/${file.guid}${extname(file.fileName)}`
                  );
                  const exists = await deleteFile.exists();
                  if (exists[0]) {
                    deleteFile.delete();
                  }
                } catch (ex) {
                  console.log(ex);
                }
                const newGUID: string = uuid();
                const fileName =
                  value[i].fileName ?? `${moment().format("YYYY-MM-DD_HH-mm")}`;
                file.fileName = fileName;
                file.guid = newGUID;
                const bucketFile = bucket.file(
                  `slides/${newGUID}${extname(fileName)}`
                );
                const img = Buffer.from(value[i].image.split(",")[1], "base64");
                await bucketFile.save(img).then(async (res) => {
                  console.log("res");
                  console.log(res);
                  const url = await bucketFile.getSignedUrl({
                    action: "read",
                    expires: "03-09-2500",
                  });

                  file.url = url[0];
                  file = await entityManager.save(File, file);
                  value[i].fileId = file.fileId;
                  value[i].image = file.url;
                });
              } else {
                const fileName =
                  value[i].fileName ?? `${moment().format("YYYY-MM-DD_HH-mm")}`;
                const newGUID: string = uuid();
                file = new File();
                file.fileName = fileName;
                file.guid = newGUID;
                const bucketFile = bucket.file(
                  `slides/${newGUID}${extname(fileName)}`
                );
                const img = Buffer.from(value[i].image.split(",")[1], "base64");
                await bucketFile.save(img).then(async (res) => {
                  console.log("res");
                  console.log(res);
                  const url = await bucketFile.getSignedUrl({
                    action: "read",
                    expires: "03-09-2500",
                  });

                  file.url = url[0];
                  file = await entityManager.save(File, file);
                  value[i].fileId = file.fileId;
                  value[i].image = file.url;
                });
              }
            }
          }
        }

        systemConfig.value = value;
        await entityManager.save(SystemConfig, systemConfig);

        return await entityManager.find(SystemConfig);
      }
    );
  }
}
