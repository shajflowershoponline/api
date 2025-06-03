import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/db/entities/Category";
import { CategoryService } from "src/services/category.service";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
