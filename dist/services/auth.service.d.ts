import { Repository } from "typeorm";
import { RegisterCustomerUserDto } from "src/core/dto/auth/register.dto";
import { VerifyCustomerUserDto } from "src/core/dto/auth/verify.dto";
import { EmailService } from "./email.service";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { StaffUser } from "src/db/entities/StaffUser";
import { CustomerUserResetPasswordDto, CustomerUserResetPasswordSubmitDto, CustomerUserResetVerifyDto } from "src/core/dto/auth/reset-password.dto";
export declare class AuthService {
    private readonly customerUserRepo;
    private readonly staffUserRepo;
    private emailService;
    constructor(customerUserRepo: Repository<CustomerUser>, staffUserRepo: Repository<StaffUser>, emailService: EmailService);
    registerCustomer(dto: RegisterCustomerUserDto): Promise<CustomerUser>;
    registerVerifyCustomer(dto: VerifyCustomerUserDto): Promise<CustomerUser>;
    getStaffByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<StaffUser>;
    getCustomerByCredentials({ email, password }: {
        email: any;
        password: any;
    }): Promise<CustomerUser>;
    verifyCustomerUser(customerUserCode: any, hash: any): Promise<boolean>;
    customerUserResetPasswordSubmit(dto: CustomerUserResetPasswordSubmitDto): Promise<boolean>;
    customerUserResetPasswordVerify(dto: CustomerUserResetVerifyDto): Promise<boolean>;
    customerUserResetPassword(dto: CustomerUserResetPasswordDto): Promise<CustomerUser>;
}
