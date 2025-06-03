export declare class StaffAccessPagesDto {
    page: string;
    view: boolean;
    modify: boolean;
    rights: string[];
}
export declare class DefaultStaffAccessDto {
    name: string;
    accessPages: StaffAccessPagesDto[];
}
