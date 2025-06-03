import { Module } from "@nestjs/common";
import { StaffAccessController } from "./staff-access.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StaffAccess } from "src/db/entities/StaffAccess";
import { StaffAccessService } from "src/services/staff-access.service";

@Module({
  imports: [TypeOrmModule.forFeature([StaffAccess])],
  controllers: [StaffAccessController],
  providers: [StaffAccessService],
  exports: [StaffAccessService],
})
export class StaffAccessModule {}
