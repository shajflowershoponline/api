import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "src/services/cart.service";
import { CartItems } from "src/db/entities/CartItems";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CartItems])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
