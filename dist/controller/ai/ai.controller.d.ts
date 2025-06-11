import { ApiResponseModel } from "src/core/models/api-response.model";
import { AIService } from "src/services/ai.service";
export declare class AIController {
    private readonly aiService;
    constructor(aiService: AIService);
    create(dto: {
        query: string;
        customerUserId: string;
    }): Promise<ApiResponseModel<any>>;
}
