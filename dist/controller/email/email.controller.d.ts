import { ApiResponseModel } from "src/core/models/api-response.model";
import { EmailService } from "src/services/email.service";
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    getPagination(paginationParams: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<ApiResponseModel<any>>;
}
