import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { GiftAddOns } from "src/db/entities/GiftAddOns";
import { GiftAddOnsService } from "src/services/gift-add-ons.service";
import { GiftAddOnsController } from "./gift-add-ons.controller";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([GiftAddOns])],
  controllers: [GiftAddOnsController],
  providers: [GiftAddOnsService],
  exports: [GiftAddOnsService],
})
export class GiftAddOnsModule {}
