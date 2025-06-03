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
import { CreateCategoryDto } from "src/core/dto/category/category.create.dto";
import { UpdateCategoryOrderDto } from "src/core/dto/category/category.update-order.dto";
import { UpdateCategoryDto } from "src/core/dto/category/category.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Category } from "src/db/entities/Category";
import { CategoryService } from "src/services/category.service";

@ApiTags("category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("/:categoryId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("categoryId") categoryId: string) {
    const res = {} as ApiResponseModel<Category>;
    try {
      res.data = await this.categoryService.getById(categoryId);
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
        order: { type: "object", default: { sequenceId: "ASC" } },
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
    const res: ApiResponseModel<{ results: Category[]; total: number }> =
      {} as any;
    try {
      res.data = await this.categoryService.getPagination(params);
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
  async create(@Body() accessDto: CreateCategoryDto) {
    const res: ApiResponseModel<Category> = {} as any;
    try {
      res.data = await this.categoryService.create(accessDto);
      res.success = true;
      res.message = `Category ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateOrder")
  //   @UseGuards(JwtAuthGuard)
  async updateOrder(@Body() dto: UpdateCategoryOrderDto[]) {
    const res: ApiResponseModel<Category[]> = {} as any;
    try {
      res.data = await this.categoryService.updateOrder(dto);
      res.success = true;
      res.message = `Category ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:categoryId")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("categoryId") categoryId: string,
    @Body() dto: UpdateCategoryDto
  ) {
    const res: ApiResponseModel<Category> = {} as any;
    try {
      res.data = await this.categoryService.update(categoryId, dto);
      res.success = true;
      res.message = `Category ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:categoryId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("categoryId") categoryId: string) {
    const res: ApiResponseModel<Category> = {} as any;
    try {
      res.data = await this.categoryService.delete(categoryId);
      res.success = true;
      res.message = `Category ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
