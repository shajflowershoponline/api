import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { CreateStaffAccessDto } from "src/core/dto/staff-access/staff-access.create.dto";
import { UpdateStaffAccessDto } from "src/core/dto/staff-access/staff-access.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { StaffAccess } from "src/db/entities/StaffAccess";
import { StaffAccessService } from "src/services/staff-access.service";
export declare class StaffAccessController {
    private readonly staffAccessService;
    constructor(staffAccessService: StaffAccessService);
    getDetails(staffAccessCode: string): Promise<ApiResponseModel<StaffAccess>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: StaffAccess[];
        total: number;
    }>>;
    create(accessDto: CreateStaffAccessDto): Promise<ApiResponseModel<StaffAccess>>;
    update(staffAccessCode: string, dto: UpdateStaffAccessDto): Promise<ApiResponseModel<StaffAccess>>;
    delete(staffAccessCode: string): Promise<ApiResponseModel<StaffAccess>>;
}
