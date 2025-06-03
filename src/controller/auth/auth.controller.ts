import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Headers,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import {
  CustomerUserLogInDto,
  StaffUserLogInDto,
} from "src/core/dto/auth/login.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import {
  REGISTER_SUCCESS,
  VERIFICATION_SUCCESS,
} from "src/common/constant/api-response.constant";
import { RegisterCustomerUserDto } from "src/core/dto/auth/register.dto";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { VerifyCustomerUserDto } from "src/core/dto/auth/verify.dto";
import { StaffUser } from "src/db/entities/StaffUser";
import {
  CustomerUserResetPasswordDto,
  CustomerUserResetPasswordSubmitDto,
  CustomerUserResetVerifyDto,
} from "src/core/dto/auth/reset-password.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/customer")
  public async registerClient(@Body() dto: RegisterCustomerUserDto) {
    const res: ApiResponseModel<CustomerUser> = {} as any;
    try {
      res.data = await this.authService.registerCustomer(dto);
      res.success = true;
      res.message = `${REGISTER_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("register/verifyCustomer")
  public async registerVerifyCustomer(@Body() dto: VerifyCustomerUserDto) {
    const res: ApiResponseModel<CustomerUser> = {} as any;
    try {
      res.data = await this.authService.registerVerifyCustomer(dto);
      res.success = true;
      res.message = `${VERIFICATION_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("login/staff")
  public async loginStaffUser(@Body() dto: StaffUserLogInDto) {
    const res: ApiResponseModel<StaffUser> = {} as ApiResponseModel<StaffUser>;
    try {
      res.data = await this.authService.getStaffByCredentials(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("login/customer")
  public async loginCustomer(@Body() dto: CustomerUserLogInDto) {
    const res: ApiResponseModel<CustomerUser> =
      {} as ApiResponseModel<CustomerUser>;
    try {
      res.data = await this.authService.getCustomerByCredentials(dto);
      res.success = true;
      return res;
    } catch (e) {
      throw new HttpException(
        e.message !== undefined ? e.message : e,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post("reset/customerUserResetPassword")
  public async customerUserResetPassword(
    @Body() dto: CustomerUserResetPasswordDto
  ) {
    const res: ApiResponseModel<CustomerUser> = {} as any;
    try {
      res.data = await this.authService.customerUserResetPassword(dto);
      res.success = true;
      res.message = `${VERIFICATION_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("reset/customerUserResetPasswordSubmit")
  public async customerUserResetPasswordSubmit(
    @Body() dto: CustomerUserResetPasswordSubmitDto
  ) {
    const res: ApiResponseModel<boolean> = {} as any;
    try {
      res.data = await this.authService.customerUserResetPasswordSubmit(dto);
      res.success = true;
      res.message = `Reset password email verification sent!`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("reset/customerUserVerify")
  public async customerUserResetPasswordVerify(
    @Body() dto: CustomerUserResetVerifyDto
  ) {
    const res: ApiResponseModel<boolean> = {} as any;
    try {
      res.data = await this.authService.customerUserResetPasswordVerify(dto);
      res.success = true;
      res.message = `${VERIFICATION_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
