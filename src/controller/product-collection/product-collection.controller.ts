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
import { CreateProductCollectionDto } from "src/core/dto/product-collection/product-collection.create.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { ProductCollectionService } from "src/services/product-collection.service";

@ApiTags("product-collection")
@Controller("product-collection")
export class ProductCollectionController {
  constructor(private readonly collectionService: ProductCollectionService) {}

  @Get("/:productCollectionId")
  //   @UseGuards(JwtAuthGuard)
  async getById(@Param("productCollectionId") productCollectionId: string) {
    const res = {} as ApiResponseModel<ProductCollection>;
    try {
      res.data = await this.collectionService.getById(productCollectionId);
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
  async getPagination(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{
      results: ProductCollection[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.collectionService.getPagination(params);
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
  async create(@Body() accessDto: CreateProductCollectionDto) {
    const res: ApiResponseModel<ProductCollection> = {} as any;
    try {
      res.data = await this.collectionService.create(accessDto);
      res.success = true;
      res.message = `Product Collection ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:collectionId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("collectionId") collectionId: string) {
    const res: ApiResponseModel<ProductCollection> = {} as any;
    try {
      res.data = await this.collectionService.delete(collectionId);
      res.success = true;
      res.message = `Product Collection ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
