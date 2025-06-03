import { DeliveryService } from "src/services/delivery.service";
import { Module } from "@nestjs/common";
import { DeliveryController } from "./delivery.controller";
import { HttpModule } from "@nestjs/axios";
import { SystemConfigService } from "src/services/system-config.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SystemConfig } from "src/db/entities/SystemConfig";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([SystemConfig])],
  controllers: [DeliveryController],
  providers: [DeliveryService, SystemConfigService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
