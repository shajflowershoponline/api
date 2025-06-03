import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { Repository } from "typeorm";

@Injectable()
export class SystemConfigService {
  constructor(
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
}
