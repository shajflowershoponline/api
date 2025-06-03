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
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { CreateStaffUserDto } from "src/core/dto/staff-user/staff-user.create.dto";
import {
  UpdateStaffUserDto,
  UpdateStaffUserProfileDto,
} from "src/core/dto/staff-user/staff-user.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { StaffUser } from "src/db/entities/StaffUser";
import { StaffUserService } from "src/services/staff-user.service";

@ApiTags("staff-user")
@Controller("staff-user")
// @ApiBearerAuth("jwt")
export class StaffUserController {
  constructor(private readonly staffUserService: StaffUserService) {}

  @Get("/:staffUserCode")
  //   @UseGuards(JwtAuthGuard)
  async getByCode(@Param("staffUserCode") staffUserCode: string) {
    const res = {} as ApiResponseModel<StaffUser>;
    try {
      res.data = await this.staffUserService.getByCode(staffUserCode);
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
    const res: ApiResponseModel<{ results: StaffUser[]; total: number }> =
      {} as any;
    try {
      res.data = await this.staffUserService.getPagination(paginationParams);
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
  async create(@Body() dto: CreateStaffUserDto) {
    const res: ApiResponseModel<StaffUser> = {} as any;
    try {
      res.data = await this.staffUserService.create(dto);
      res.success = true;
      res.message = `User  ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateProfile/:staffUserCode")
  //   @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param("staffUserCode") staffUserCode: string,
    @Body() dto: UpdateStaffUserProfileDto
  ) {
    const res: ApiResponseModel<StaffUser> = {} as any;
    try {
      res.data = await this.staffUserService.updateProfile(staffUserCode, dto);
      res.success = true;
      res.message = `User ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:staffUserCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("staffUserCode") staffUserCode: string,
    @Body() dto: UpdateStaffUserDto
  ) {
    const res: ApiResponseModel<StaffUser> = {} as any;
    try {
      res.data = await this.staffUserService.update(staffUserCode, dto);
      res.success = true;
      res.message = `User ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:staffUserCode")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("staffUserCode") staffUserCode: string) {
    const res: ApiResponseModel<StaffUser> = {} as any;
    try {
      res.data = await this.staffUserService.delete(staffUserCode);
      res.success = true;
      res.message = `User ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
