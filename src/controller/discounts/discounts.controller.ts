import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { CreateDiscountDto } from "src/core/dto/discounts/discounts.create.dto";
import { UpdateDiscountDto } from "src/core/dto/discounts/discounts.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Discounts } from "src/db/entities/Discounts";
import { DiscountsService } from "src/services/discounts.service";

@ApiTags("discounts")
@Controller("discounts")
export class DiscountsController {
  constructor(private readonly discountService: DiscountsService) {}

  @Get("/:discountsId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("discountsId") discountsId: string) {
    const res = {} as ApiResponseModel<Discounts>;
    try {
      res.data = await this.discountService.getById(discountsId);
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
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        pageSize: { type: "number", example: 10 },
        pageIndex: { type: "number", example: 0 },
        order: { type: "object", default: { name: "ASC" } },
        keywords: { type: "string", example: "", default: "" },
      },
      required: ["pageSize", "pageIndex", "order", "keywords"],
    },
  })
  async getPaginated(
    @Body()
    params: {
      pageSize: string;
      pageIndex: string;
      order: string;
      keywords: string;
    }
  ) {
    const res: ApiResponseModel<{ results: Discounts[]; total: number }> =
      {} as any;
    try {
      res.data = (await this.discountService.getPagination(params)) as any;
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
  async create(@Body() accessDto: CreateDiscountDto) {
    const res: ApiResponseModel<Discounts> = {} as any;
    try {
      res.data = await this.discountService.create(accessDto);
      res.success = true;
      res.message = `Discounts ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:discountsId")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("discountsId") discountsId: string,
    @Body() dto: UpdateDiscountDto
  ) {
    const res: ApiResponseModel<Discounts> = {} as any;
    try {
      res.data = await this.discountService.update(discountsId, dto);
      res.success = true;
      res.message = `Discounts ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:discountsId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("discountsId") discountsId: string) {
    const res: ApiResponseModel<Discounts> = {} as any;
    try {
      res.data = await this.discountService.delete(discountsId);
      res.success = true;
      res.message = `Discounts ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
