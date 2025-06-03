import { CreateStaffUserDto } from "src/core/dto/staff-user/staff-user.create.dto";
import { UpdateStaffUserDto, UpdateStaffUserProfileDto } from "src/core/dto/staff-user/staff-user.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { StaffUser } from "src/db/entities/StaffUser";
import { Repository } from "typeorm";
export declare class StaffUserService {
    private firebaseProvoder;
    private readonly staffUserRepo;
    constructor(firebaseProvoder: FirebaseProvider, staffUserRepo: Repository<StaffUser>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: StaffUser[];
        total: number;
    }>;
    getByCode(staffUserCode: any): Promise<StaffUser>;
    create(dto: CreateStaffUserDto): Promise<StaffUser>;
    updateProfile(staffUserCode: any, dto: UpdateStaffUserProfileDto): Promise<StaffUser>;
    update(staffUserCode: any, dto: UpdateStaffUserDto): Promise<StaffUser>;
    delete(staffUserCode: any): Promise<StaffUser>;
}
