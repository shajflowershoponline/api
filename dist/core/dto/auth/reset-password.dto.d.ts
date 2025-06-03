export declare class CustomerUserResetPasswordSubmitDto {
    email: string;
}
export declare class CustomerUserResetVerifyDto extends CustomerUserResetPasswordSubmitDto {
    otp: string;
}
export declare class ProfileResetPasswordDto {
    currentPassword: string;
    password: string;
    confirmPassword: string;
}
export declare class UpdateUserPasswordDto {
    password: string;
    confirmPassword: string;
}
export declare class CustomerUserResetPasswordDto extends CustomerUserResetVerifyDto {
    password: string;
    confirmPassword: string;
}
