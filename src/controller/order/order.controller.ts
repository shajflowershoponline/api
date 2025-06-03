import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { SAVING_SUCCESS } from "src/common/constant/api-response.constant";
import { CreateOrderDto } from "src/core/dto/order/order.create.dto";
import { UpdateOrderStatusDto } from "src/core/dto/order/order.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Order } from "src/db/entities/Order";
import { OrderService } from "src/services/order.service";

@ApiTags("order")
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("/:orderCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("orderCode") orderCode: string) {
    const res = {} as ApiResponseModel<Order>;
    try {
      res.data = await this.orderService.getByOrderCode(orderCode);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/my-orders")
  //   @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        customerUserId: { type: "string" },
        pageSize: { type: "number", example: 10 },
        pageIndex: { type: "number", example: 0 },
        keywords: { type: "string", example: "", default: "" },
      },
      required: ["customerUserId", "pageSize", "pageIndex", "keywords"],
    },
  })
  async getByCustomerUser(
    @Body()
    params: {
      customerUserId: string;
      pageSize: string;
      pageIndex: string;
      keywords: string;
    } = {
      customerUserId: null,
      pageSize: "10",
      pageIndex: "0",
      keywords: "",
    }
  ) {
    const res: ApiResponseModel<{ results: Order[]; total: number }> =
      {} as any;
    try {
      res.data = await this.orderService.getByCustomerUser(params);
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
    const res: ApiResponseModel<{ results: Order[]; total: number }> =
      {} as any;
    try {
      res.data = await this.orderService.getPagination(params);
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
  async create(@Body() dto: CreateOrderDto) {
    const res: ApiResponseModel<Order> = {} as any;
    try {
      res.data = await this.orderService.create(dto);
      res.success = true;
      res.message = `Order ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("status/:orderCode")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("orderCode") orderCode: string,
    @Body() dto: UpdateOrderStatusDto
  ) {
    const res: ApiResponseModel<Order> = {} as any;
    try {
      res.data = await this.orderService.updateStatus(orderCode, dto);
      res.success = true;
      res.message = `Order ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
