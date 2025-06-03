import { CreateGiftAddOnDto } from "src/core/dto/gift-add-ons/gift-add-ons.create.dto";
import { UpdateGiftAddOnDto } from "src/core/dto/gift-add-ons/gift-add-ons.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { GiftAddOns } from "src/db/entities/GiftAddOns";
import { GiftAddOnsService } from "src/services/gift-add-ons.service";
export declare class GiftAddOnsController {
    private readonly giftAddOnsService;
    constructor(giftAddOnsService: GiftAddOnsService);
    getDetails(giftAddOnId: string): Promise<ApiResponseModel<GiftAddOns>>;
    getPaginated(params?: {
        pageSize: string;
        pageIndex: string;
        order: any;
        keywords: string;
    }): Promise<ApiResponseModel<{
        results: GiftAddOns[];
        total: number;
    }>>;
    create(accessDto: CreateGiftAddOnDto): Promise<ApiResponseModel<GiftAddOns>>;
    update(giftAddOnId: string, dto: UpdateGiftAddOnDto): Promise<ApiResponseModel<GiftAddOns>>;
    delete(giftAddOnId: string): Promise<ApiResponseModel<GiftAddOns>>;
}
