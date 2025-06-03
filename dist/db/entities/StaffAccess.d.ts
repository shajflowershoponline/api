import { StaffUser } from "./StaffUser";
export declare class StaffAccess {
    staffAccessId: string;
    staffAccessCode: string | null;
    name: string;
    accessPages: object;
    active: boolean;
    staffUsers: StaffUser[];
}
