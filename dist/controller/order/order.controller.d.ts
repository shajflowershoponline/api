import { CreateOrderDto } from "src/core/dto/order/order.create.dto";
import { UpdateOrderStatusDto } from "src/core/dto/order/order.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Order } from "src/db/entities/Order";
import { OrderService } from "src/services/order.service";
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getDetails(orderCode: string): Promise<ApiResponseModel<Order>>;
    getByCustomerUser(params?: {
        customerUserId: string;
        pageSize: string;
        pageIndex: string;
        keywords: string;
    }): Promise<ApiResponseModel<{
        results: Order[];
        total: number;
    }>>;
    getPagination(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Order[];
        total: number;
    }>>;
    create(dto: CreateOrderDto): Promise<ApiResponseModel<Order>>;
    updateStatus(orderCode: string, dto: UpdateOrderStatusDto): Promise<ApiResponseModel<Order>>;
}
