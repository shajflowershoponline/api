import { Module } from "@nestjs/common";
import { AIController } from "./ai.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AIService } from "src/services/ai.service";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { HttpModule } from "@nestjs/axios";
import { Product } from "src/db/entities/Product";
import { Category } from "src/db/entities/Category";
import { Collection } from "src/db/entities/Collection";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { CartItems } from "src/db/entities/CartItems";
import { Order } from "src/db/entities/Order";
import { OrderItems } from "src/db/entities/OrderItems";
import { CustomerUserWishlist } from "src/db/entities/CustomerUserWishlist";
import { ProductService } from "src/services/product.service";
import { CategoryService } from "src/services/category.service";
import { CustomerUserAiSearch } from "src/db/entities/CustomerUserAiSearch";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([
      Product,
      Category,
      Collection,
      ProductCollection,
      CartItems,
      Order,
      OrderItems,
      CustomerUserWishlist,
      CustomerUserAiSearch
    ]),
  ],
  controllers: [AIController],
  providers: [AIService, ProductService, CategoryService],
  exports: [AIService],
})
export class AIModule {}
