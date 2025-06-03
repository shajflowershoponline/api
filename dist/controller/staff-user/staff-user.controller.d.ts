import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { CreateStaffUserDto } from "src/core/dto/staff-user/staff-user.create.dto";
import { UpdateStaffUserDto, UpdateStaffUserProfileDto } from "src/core/dto/staff-user/staff-user.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { StaffUser } from "src/db/entities/StaffUser";
import { StaffUserService } from "src/services/staff-user.service";
export declare class StaffUserController {
    private readonly staffUserService;
    constructor(staffUserService: StaffUserService);
    getByCode(staffUserCode: string): Promise<ApiResponseModel<StaffUser>>;
    getPagination(paginationParams: PaginationParamsDto): Promise<ApiResponseModel<{
        results: StaffUser[];
        total: number;
    }>>;
    create(dto: CreateStaffUserDto): Promise<ApiResponseModel<StaffUser>>;
    updateProfile(staffUserCode: string, dto: UpdateStaffUserProfileDto): Promise<ApiResponseModel<StaffUser>>;
    update(staffUserCode: string, dto: UpdateStaffUserDto): Promise<ApiResponseModel<StaffUser>>;
    delete(staffUserCode: string): Promise<ApiResponseModel<StaffUser>>;
}
