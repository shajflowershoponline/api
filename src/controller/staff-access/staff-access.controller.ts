import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { CreateStaffAccessDto } from "src/core/dto/staff-access/staff-access.create.dto";
import { UpdateStaffAccessDto } from "src/core/dto/staff-access/staff-access.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { StaffAccess } from "src/db/entities/StaffAccess";
import { StaffAccessService } from "src/services/staff-access.service";

@ApiTags("staff-access")
@Controller("staff-access")
export class StaffAccessController {
  constructor(private readonly staffAccessService: StaffAccessService) {}

  @Get("/:staffAccessCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("staffAccessCode") staffAccessCode: string) {
    const res = {} as ApiResponseModel<StaffAccess>;
    try {
      res.data = await this.staffAccessService.getByCode(staffAccessCode);
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
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{ results: StaffAccess[]; total: number }> =
      {} as any;
    try {
      res.data = await this.staffAccessService.getPagination(params);
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
  async create(@Body() accessDto: CreateStaffAccessDto) {
    const res: ApiResponseModel<StaffAccess> = {} as any;
    try {
      res.data = await this.staffAccessService.create(accessDto);
      res.success = true;
      res.message = `User group ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:staffAccessCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("staffAccessCode") staffAccessCode: string,
    @Body() dto: UpdateStaffAccessDto
  ) {
    const res: ApiResponseModel<StaffAccess> = {} as any;
    try {
      res.data = await this.staffAccessService.update(staffAccessCode, dto);
      res.success = true;
      res.message = `User group ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:staffAccessCode")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("staffAccessCode") staffAccessCode: string) {
    const res: ApiResponseModel<StaffAccess> = {} as any;
    try {
      res.data = await this.staffAccessService.delete(staffAccessCode);
      res.success = true;
      res.message = `User group ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
