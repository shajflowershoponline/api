import { Module } from "@nestjs/common";
import { CustomerUserWishListController } from "./customer-user-wish-list.controller";
import { CustomerUserWishListService } from "src/services/customer-user-wish-list.service";
import { CustomerUserWishlist } from "src/db/entities/CustomerUserWishlist";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CustomerUserWishlist])],
  controllers: [CustomerUserWishListController],
  providers: [CustomerUserWishListService],
  exports: [CustomerUserWishListService],
})
export class CustomerUserWishListModule {}
