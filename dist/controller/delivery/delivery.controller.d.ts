import { DeliveryService } from "src/services/delivery.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    search(body: {
        pickupCoords: {
            lat: number;
            lng: number;
        };
        dropoffCoords: {
            lat: number;
            lng: number;
        };
    }): Promise<ApiResponseModel<any>>;
}
