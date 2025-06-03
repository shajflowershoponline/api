import { DefaultStaffUserDto } from "./staff-user-base.dto";
export declare class CreateStaffUserDto extends DefaultStaffUserDto {
    password: string;
    staffAccessCode: string;
}
