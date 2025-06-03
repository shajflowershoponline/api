import { CreateStaffAccessDto } from "src/core/dto/staff-access/staff-access.create.dto";
import { UpdateStaffAccessDto } from "src/core/dto/staff-access/staff-access.update.dto";
import { StaffAccess } from "src/db/entities/StaffAccess";
import { Repository } from "typeorm";
export declare class StaffAccessService {
    private readonly staffAccessRepo;
    constructor(staffAccessRepo: Repository<StaffAccess>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: StaffAccess[];
        total: number;
    }>;
    getByCode(staffAccessCode: any): Promise<StaffAccess>;
    create(dto: CreateStaffAccessDto): Promise<StaffAccess>;
    update(staffAccessCode: any, dto: UpdateStaffAccessDto): Promise<StaffAccess>;
    delete(staffAccessCode: any): Promise<StaffAccess>;
}
