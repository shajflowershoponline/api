import { StaffAccess } from "./StaffAccess";
export declare class StaffUser {
    staffUserId: string;
    staffUserCode: string | null;
    userName: string;
    password: string;
    name: string;
    accessGranted: boolean | null;
    active: boolean;
    staffAccess: StaffAccess;
}
