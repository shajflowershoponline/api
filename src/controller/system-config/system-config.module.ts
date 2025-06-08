import { Module } from "@nestjs/common";
import { SystemConfigController } from "./system-config.controller";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SystemConfigService } from "src/services/system-config.service";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([SystemConfig])],
  controllers: [SystemConfigController],
  providers: [SystemConfigService],
  exports: [SystemConfigService],
})
export class SystemConfigModule {}
