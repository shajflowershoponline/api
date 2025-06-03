import { DefaultCustomerUserDto } from "./customer-user-base.dto";
import { CoordinatesDto } from "../map/map.dto";
export declare class UpdateCustomerUserDto extends DefaultCustomerUserDto {
    accessCode: string;
}
export declare class UpdateCustomerUserProfileDto extends DefaultCustomerUserDto {
    userProfilePic: any;
    mobileNumber: string;
    address: string;
    addressLandmark: string;
    addressCoordinates: CoordinatesDto;
}
