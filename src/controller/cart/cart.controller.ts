import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SAVING_SUCCESS } from "src/common/constant/api-response.constant";
import { CartCustomerCouponDto } from "src/core/dto/cart-item/cart-customer-coupon.dto";
import { CreateCartItemDto } from "src/core/dto/cart-item/cart-item.create.dto";
import { UpdateCartDto } from "src/core/dto/cart-item/cart-item.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { CartItems } from "src/db/entities/CartItems";
import { Collection } from "src/db/entities/Collection";
import { CustomerCoupon } from "src/db/entities/CustomerCoupon";
import { CartService } from "src/services/cart.service";

@ApiTags("cart")
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get("/getItems/:customerUserId")
  //   @UseGuards(JwtAuthGuard)
  async getItems(@Param("customerUserId") customerUserId: string) {
    const res = {} as ApiResponseModel<{
      results: CartItems[];
      activeCoupon: CustomerCoupon;
      collections: Collection[];
    }>;
    try {
      res.data = await this.cartService.getItems(customerUserId);
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
  async create(@Body() dto: CreateCartItemDto) {
    const res: ApiResponseModel<CartItems> = {} as any;
    try {
      res.data = await this.cartService.create(dto);
      res.success = true;
      res.message = `Cart item ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("")
  //   @UseGuards(JwtAuthGuard)
  async update(@Body() dto: UpdateCartDto) {
    const res: ApiResponseModel<CartItems[]> = {} as any;
    try {
      res.data = await this.cartService.update(dto);
      res.success = true;
      res.message = `Cart item ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/coupon")
  //   @UseGuards(JwtAuthGuard)
  async manageCoupon(@Body() dto: CartCustomerCouponDto) {
    const res: ApiResponseModel<CustomerCoupon> = {} as any;
    try {
      res.data = await this.cartService.manageCoupon(dto);
      res.success = true;
      res.message = `Customer coupon ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
  @Get("/customerUserCoupon/:customerUserId")
  //   @UseGuards(JwtAuthGuard)
  async getActiveCoupon(@Param("customerUserId") customerUserId: string) {
    const res = {} as ApiResponseModel<CustomerCoupon>;
    try {
      res.data = await this.cartService.getActiveCoupon(customerUserId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
