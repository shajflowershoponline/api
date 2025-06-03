import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { CustomerUserLogInDto, StaffUserLogInDto } from "src/core/dto/auth/login.dto";
import { RegisterCustomerUserDto } from "src/core/dto/auth/register.dto";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { VerifyCustomerUserDto } from "src/core/dto/auth/verify.dto";
import { StaffUser } from "src/db/entities/StaffUser";
import { CustomerUserResetPasswordDto, CustomerUserResetPasswordSubmitDto, CustomerUserResetVerifyDto } from "src/core/dto/auth/reset-password.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerClient(dto: RegisterCustomerUserDto): Promise<ApiResponseModel<CustomerUser>>;
    registerVerifyCustomer(dto: VerifyCustomerUserDto): Promise<ApiResponseModel<CustomerUser>>;
    loginStaffUser(dto: StaffUserLogInDto): Promise<ApiResponseModel<StaffUser>>;
    loginCustomer(dto: CustomerUserLogInDto): Promise<ApiResponseModel<CustomerUser>>;
    customerUserResetPassword(dto: CustomerUserResetPasswordDto): Promise<ApiResponseModel<CustomerUser>>;
    customerUserResetPasswordSubmit(dto: CustomerUserResetPasswordSubmitDto): Promise<ApiResponseModel<boolean>>;
    customerUserResetPasswordVerify(dto: CustomerUserResetVerifyDto): Promise<ApiResponseModel<boolean>>;
}
