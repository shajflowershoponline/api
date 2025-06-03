export declare enum UpdateStatusEnums {
    DELIVERY = "DELIVERY",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class UpdateOrderStatusDto {
    status: UpdateStatusEnums;
}
