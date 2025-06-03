import { CreateOrderDto } from "src/core/dto/order/order.create.dto";
import { Order } from "src/db/entities/Order";
import { Repository } from "typeorm";
import { DeliveryService } from "./delivery.service";
import { ConfigService } from "@nestjs/config";
import { UpdateOrderStatusDto } from "src/core/dto/order/order.update.dto";
export declare class OrderService {
    private readonly orderRepo;
    private readonly deliveryService;
    private readonly config;
    private STORE_LOCATION_COORDINATES;
    constructor(orderRepo: Repository<Order>, deliveryService: DeliveryService, config: ConfigService);
    getByCustomerUser({ customerUserId, pageSize, pageIndex, keywords }: {
        customerUserId: any;
        pageSize: any;
        pageIndex: any;
        keywords: any;
    }): Promise<{
        results: Order[];
        total: number;
    }>;
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Order[];
        total: number;
    }>;
    getByOrderCode(orderCode: any): Promise<Order>;
    create(dto: CreateOrderDto): Promise<Order>;
    updateStatus(orderCode: any, dto: UpdateOrderStatusDto): Promise<Order>;
}
