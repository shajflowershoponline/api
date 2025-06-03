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
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
  DELETE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { CreateCustomerUserWishlistDto } from "src/core/dto/customer-user-wish-list/customer-user-wish-list.create.dto";
import { UpdateCustomerUserWishlistDto } from "src/core/dto/customer-user-wish-list/customer-user-wish-list.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { CustomerUserWishlist } from "src/db/entities/CustomerUserWishlist";
import { CustomerUserWishListService } from "src/services/customer-user-wish-list.service";

@ApiTags("customer-user-wish-list")
@Controller("customer-user-wish-list")
export class CustomerUserWishListController {
  constructor(
    private readonly customerUserWishlistService: CustomerUserWishListService
  ) {}

  @Get("/:customerUserWishlistId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(
    @Param("customerUserWishlistId") customerUserWishlistId: string
  ) {
    const res = {} as ApiResponseModel<CustomerUserWishlist>;
    try {
      res.data = await this.customerUserWishlistService.getById(
        customerUserWishlistId
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/get-by-sku/:customerUserId/:sku")
  //   @UseGuards(JwtAuthGuard)
  async getBySKU(
    @Param("customerUserId") customerUserId: string,
    @Param("sku") sku: string
  ) {
    const res = {} as ApiResponseModel<CustomerUserWishlist>;
    try {
      res.data = await this.customerUserWishlistService.getBySKU(
        customerUserId,
        sku
      );
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
        customerUserId: { type: "string" },
        pageSize: { type: "number", example: 10 },
        pageIndex: { type: "number", example: 0 },
        order: { type: "object", default: { name: "ASC" } },
        keywords: { type: "string", example: "", default: "" },
      },
      required: [
        "customerUserId",
        "pageSize",
        "pageIndex",
        "order",
        "keywords",
      ],
    },
  })
  async getPaginated(
    @Body()
    params: {
      customerUserId: string;
      pageSize: string;
      pageIndex: string;
      order: string;
      keywords: string;
    }
  ) {
    const res: ApiResponseModel<{
      results: CustomerUserWishlist[];
      total: number;
    }> = {} as any;
    try {
      res.data = (await this.customerUserWishlistService.getPagination(
        params
      )) as any;
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
  async create(@Body() accessDto: CreateCustomerUserWishlistDto) {
    const res: ApiResponseModel<CustomerUserWishlist> = {} as any;
    try {
      res.data = await this.customerUserWishlistService.create(accessDto);
      res.success = true;
      res.message = `Customer User Wishlist ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:customerUserWishlistId")
  //   @UseGuards(JwtAuthGuard)
  async delete(
    @Param("customerUserWishlistId") customerUserWishlistId: string
  ) {
    const res: ApiResponseModel<CustomerUserWishlist> = {} as any;
    try {
      res.data = await this.customerUserWishlistService.delete(
        customerUserWishlistId
      );
      res.success = true;
      res.message = `Customer User Wishlist ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
