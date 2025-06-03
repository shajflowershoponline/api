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
import { CreateGiftAddOnDto } from "src/core/dto/gift-add-ons/gift-add-ons.create.dto";
import { UpdateGiftAddOnDto } from "src/core/dto/gift-add-ons/gift-add-ons.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { GiftAddOns } from "src/db/entities/GiftAddOns";
import { GiftAddOnsService } from "src/services/gift-add-ons.service";

@ApiTags("gift-add-ons")
@Controller("gift-add-ons")
export class GiftAddOnsController {
  constructor(private readonly giftAddOnsService: GiftAddOnsService) {}

  @Get("/:giftAddOnId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("giftAddOnId") giftAddOnId: string) {
    const res = {} as ApiResponseModel<GiftAddOns>;
    try {
      res.data = await this.giftAddOnsService.getById(giftAddOnId);
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
      order: any;
      keywords: string;
    } = { pageSize: "10", pageIndex: "0", order: { name: "ASC" }, keywords: "" }
  ) {
    const res: ApiResponseModel<{ results: GiftAddOns[]; total: number }> =
      {} as any;
    try {
      res.data = await this.giftAddOnsService.getPagination(params);
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
  async create(@Body() accessDto: CreateGiftAddOnDto) {
    const res: ApiResponseModel<GiftAddOns> = {} as any;
    try {
      res.data = await this.giftAddOnsService.create(accessDto);
      res.success = true;
      res.message = `Gift Add Ons ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:giftAddOnId")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("giftAddOnId") giftAddOnId: string,
    @Body() dto: UpdateGiftAddOnDto
  ) {
    const res: ApiResponseModel<GiftAddOns> = {} as any;
    try {
      res.data = await this.giftAddOnsService.update(giftAddOnId, dto);
      res.success = true;
      res.message = `Gift Add Ons ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:giftAddOnId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("giftAddOnId") giftAddOnId: string) {
    const res: ApiResponseModel<GiftAddOns> = {} as any;
    try {
      res.data = await this.giftAddOnsService.delete(giftAddOnId);
      res.success = true;
      res.message = `Gift Add Ons ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
