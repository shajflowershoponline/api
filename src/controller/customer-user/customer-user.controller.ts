import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiParam } from "@nestjs/swagger";
import {
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
  DELETE_SUCCESS,
} from "src/common/constant/api-response.constant";
import {
  ProfileResetPasswordDto,
  UpdateUserPasswordDto,
} from "src/core/dto/auth/reset-password.dto";
import { CreateCustomerUserDto } from "src/core/dto/customer-user/customer-user.create.dto";
import {
  UpdateCustomerUserDto,
  UpdateCustomerUserProfileDto,
} from "src/core/dto/customer-user/customer-user.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { CustomerUserService } from "src/services/customer-user.service";

@ApiTags("customer-user")
@Controller("customer-user")
// @ApiBearerAuth("jwt")
export class CustomerUserController {
  constructor(private readonly customerUserService: CustomerUserService) {}

  @Get("/:customerUserCode")
  //   @UseGuards(JwtAuthGuard)
  async getByCode(@Param("customerUserCode") customerUserCode: string) {
    const res = {} as ApiResponseModel<CustomerUser>;
    try {
      res.data = await this.customerUserService.getByCode(customerUserCode);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPagination(@Body() paginationParams: PaginationParamsDto) {
    const res: ApiResponseModel<{ results: CustomerUser[]; total: number }> =
      {} as any;
    try {
      res.data = await this.customerUserService.getPagination(paginationParams);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  //   @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCustomerUserDto) {
    const res: ApiResponseModel<CustomerUser> = {} as any;
    try {
      res.data = await this.customerUserService.create(dto);
      res.success = true;
      res.message = `Customer user ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateProfile/:customerUserCode")
  //   @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param("customerUserCode") customerUserCode: string,
    @Body() dto: UpdateCustomerUserProfileDto
  ) {
    const res: ApiResponseModel<CustomerUser> = {} as any;
    try {
      res.data = await this.customerUserService.updateProfile(
        customerUserCode,
        dto
      );
      res.success = true;
      res.message = `Customer user ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:customerUserCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("usercustomerUserCodeCode") customerUserCode: string,
    @Body() dto: UpdateCustomerUserDto
  ) {
    const res: ApiResponseModel<CustomerUser> = {} as any;
    try {
      res.data = await this.customerUserService.update(customerUserCode, dto);
      res.success = true;
      res.message = `Customer user ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:customerUserCode")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("customerUserCode") customerUserCode: string) {
    const res: ApiResponseModel<CustomerUser> = {} as any;
    try {
      res.data = await this.customerUserService.delete(customerUserCode);
      res.success = true;
      res.message = `Customer user ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
