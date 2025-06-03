import { CoordinatesDto } from "../map/map.dto";
export declare class CreateOrderDto {
    customerUserId: string;
    paymentMethod: string;
    email: string;
    mobileNumber: string;
    deliveryAddress: string;
    deliveryAddressLandmark: string;
    deliveryAddressCoordinates: CoordinatesDto;
    promoCode: string;
    specialInstructions: string;
    notesToRider: string;
    cartItemIds: string[];
}
