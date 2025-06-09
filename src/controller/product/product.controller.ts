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
import { CreateProductDto } from "src/core/dto/product/product.create.dto";
import { UpdateProductDto } from "src/core/dto/product/product.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Product } from "src/db/entities/Product";
import { ProductService } from "src/services/product.service";
import { Category } from "src/db/entities/Category";
import { Collection } from "src/db/entities/Collection";

@ApiTags("product")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("/featured/:customerUserId")
  //   @UseGuards(JwtAuthGuard)
  async getAllFeaturedProducts(
    @Param("customerUserId") customerUserId: string
  ) {
    const res = {} as ApiResponseModel<Product[]>;
    try {
      res.data = await this.productService.getAllFeaturedProducts(
        customerUserId
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/:sku")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("sku") sku: string) {
    const res = {} as ApiResponseModel<Product>;
    try {
      res.data = await this.productService.getBySku(sku);
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
    const res: ApiResponseModel<{ results: Product[]; total: number }> =
      {} as any;
    try {
      res.data = await this.productService.getPagination(paginationParams);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/client-pagination")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        pageSize: { type: "string" },
        pageIndex: { type: "string" },
        order: { type: "object" },
        customerUserId: { type: "string" },
        keyword: { type: "string" },
        columnDef: {
          type: "array",
          items: {
            type: "object",
            properties: {
              apiNotation: { type: "string" },
              filter: { type: "string" },
              name: { type: "string" },
              type: { type: "string" },
            },
            required: ["apiNotation"],
          },
        },
      },
      required: ["pageSize", "pageIndex", "columnDef", "keyword"],
    },
  })
  //   @UseGuards(JwtAuthGuard)
  async getClientPagination(
    @Body()
    params: {
      pageSize: string;
      pageIndex: string;
      order: any;
      customerUserId: string;
      keyword: string;
      columnDef: {
        apiNotation: string;
        filter?: string;
        name: string;
        type?: string;
      }[];
    }
  ) {
    const res: ApiResponseModel<{ results: Product[]; total: number }> =
      {} as any;
    try {
      res.data = await this.productService.getClientPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/get-search-filter")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        columnDef: {
          type: "array",
          items: {
            type: "object",
            properties: {
              apiNotation: { type: "string" },
              filter: { type: "string" },
              name: { type: "string" },
              type: { type: "string" },
            },
            required: ["apiNotation"],
          },
        },
      },
      required: ["columnDef"],
    },
  })
  //   @UseGuards(JwtAuthGuard)
  async getSearchFilter(
    @Body()
    params: {
      columnDef: {
        apiNotation: string;
        filter?: string;
        name: string;
        type?: string;
      }[];
    }
  ) {
    const res: ApiResponseModel<{
      categories: Category[];
      collections: Collection[];
    }> = {} as any;
    try {
      res.data = await this.productService.getSearchFilter(params);
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
  async create(@Body() accessDto: CreateProductDto) {
    const res: ApiResponseModel<Product> = {} as any;
    try {
      res.data = await this.productService.create(accessDto);
      res.success = true;
      res.message = `Product ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:sku")
  //   @UseGuards(JwtAuthGuard)
  async update(@Param("sku") sku: string, @Body() dto: UpdateProductDto) {
    const res: ApiResponseModel<Product> = {} as any;
    try {
      res.data = await this.productService.update(sku, dto);
      res.success = true;
      res.message = `Product ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:sku")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("sku") sku: string) {
    const res: ApiResponseModel<Product> = {} as any;
    try {
      res.data = await this.productService.delete(sku);
      res.success = true;
      res.message = `Product ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
