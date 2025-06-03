import { Module } from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { EmailService } from "src/services/email.service";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { StaffUser } from "src/db/entities/StaffUser";

@Module({
  imports: [
    FirebaseProviderModule,
    TypeOrmModule.forFeature([CustomerUser, StaffUser]),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService, EmailService],
})
export class AuthModule {}
