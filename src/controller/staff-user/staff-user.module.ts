import { Module } from "@nestjs/common";
import { StaffUserController } from "./staff-user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { StaffUserService } from "src/services/staff-user.service";
import { StaffUser } from "src/db/entities/StaffUser";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([StaffUser])],
  controllers: [StaffUserController],
  providers: [StaffUserService],
  exports: [StaffUserService],
})
export class StaffUserModule {}
