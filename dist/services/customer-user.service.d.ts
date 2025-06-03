import { CreateCustomerUserDto } from "src/core/dto/customer-user/customer-user.create.dto";
import { UpdateCustomerUserDto, UpdateCustomerUserProfileDto } from "src/core/dto/customer-user/customer-user.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { Repository } from "typeorm";
export declare class CustomerUserService {
    private firebaseProvoder;
    private readonly customerUserRepo;
    constructor(firebaseProvoder: FirebaseProvider, customerUserRepo: Repository<CustomerUser>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: CustomerUser[];
        total: number;
    }>;
    getByCode(customerUserCode: any): Promise<CustomerUser>;
    create(dto: CreateCustomerUserDto): Promise<CustomerUser>;
    updateProfile(customerUserCode: any, dto: UpdateCustomerUserProfileDto): Promise<CustomerUser>;
    update(customerUserCode: any, dto: UpdateCustomerUserDto): Promise<CustomerUser>;
    delete(customerUserCode: any): Promise<CustomerUser>;
}
