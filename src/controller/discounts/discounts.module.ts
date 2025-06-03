import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { Discounts } from "src/db/entities/Discounts";
import { DiscountsService } from "src/services/discounts.service";
import { DiscountsController } from "./discounts.controller";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([Discounts])],
  controllers: [DiscountsController],
  providers: [DiscountsService],
  exports: [DiscountsService],
})
export class DiscountsModule {}
