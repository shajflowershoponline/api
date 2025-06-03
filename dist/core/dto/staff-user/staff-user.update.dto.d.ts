import { DefaultStaffUserDto } from "./staff-user-base.dto";
export declare class UpdateStaffUserDto extends DefaultStaffUserDto {
    staffAccessCode: string;
}
export declare class UpdateStaffUserProfileDto extends DefaultStaffUserDto {
    userProfilePic: any;
}
