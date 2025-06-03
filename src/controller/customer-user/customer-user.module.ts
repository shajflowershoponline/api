import { Module } from "@nestjs/common";
import { CustomerUserController } from "./customer-user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { CustomerUserService } from "src/services/customer-user.service";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([CustomerUser])],
  controllers: [CustomerUserController],
  providers: [CustomerUserService],
  exports: [CustomerUserService],
})
export class CustomerUserModule {}
