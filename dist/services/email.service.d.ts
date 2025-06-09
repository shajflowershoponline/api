import { ConfigService } from "@nestjs/config";
export declare class EmailService {
    private readonly config;
    constructor(config: ConfigService);
    sendEmailVerification(recipient: any, customerUserCode: any, otp: any): Promise<boolean>;
    sendResetPasswordOtp(recipient: any, userCode: any, otp: any): Promise<boolean>;
    sendEmailFromContact(dto: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<boolean>;
}
