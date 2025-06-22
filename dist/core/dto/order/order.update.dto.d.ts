export declare enum UpdateStatusEnums {
    PROCESSING = "PROCESSING",
    DELIVERY = "DELIVERY",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class UpdateOrderStatusDto {
    status: UpdateStatusEnums;
}
