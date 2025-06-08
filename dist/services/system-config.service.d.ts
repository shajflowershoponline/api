import { ConfigService } from "@nestjs/config";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { Repository } from "typeorm";
export declare class SystemConfigService {
    private firebaseProvider;
    private readonly systemConfigRepo;
    private readonly config;
    constructor(firebaseProvider: FirebaseProvider, systemConfigRepo: Repository<SystemConfig>, config: ConfigService);
    getAll(): Promise<SystemConfig[]>;
    save({ key, value }: {
        key: any;
        value: any;
    }): Promise<SystemConfig[]>;
}
