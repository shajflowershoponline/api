import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/db/entities/Product";
import { ProductService } from "src/services/product.service";
import { ProductImage } from "src/db/entities/ProductImage";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";

@Module({
  imports: [
    FirebaseProviderModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
