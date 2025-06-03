import { Module } from "@nestjs/common";
import { ProductCollectionController } from "./product-collection.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { ProductCollectionService } from "src/services/product-collection.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProductCollection])],
  controllers: [ProductCollectionController],
  providers: [ProductCollectionService],
  exports: [ProductCollectionService],
})
export class ProductCollectionModule {}
