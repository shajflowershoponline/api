import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { Order } from "src/db/entities/Order";
import { OrderItems } from "src/db/entities/OrderItems";
import { OrderService } from "src/services/order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { DeliveryService } from "src/services/delivery.service";
import { SystemConfigService } from "src/services/system-config.service";
import { SystemConfig } from "src/db/entities/SystemConfig";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Order, OrderItems, SystemConfig]),
  ],
  controllers: [OrderController],
  providers: [OrderService, DeliveryService, SystemConfigService],
  exports: [OrderService],
})
export class OrderModule {}
