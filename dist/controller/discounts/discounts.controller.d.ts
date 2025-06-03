import { CreateDiscountDto } from "src/core/dto/discounts/discounts.create.dto";
import { UpdateDiscountDto } from "src/core/dto/discounts/discounts.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Discounts } from "src/db/entities/Discounts";
import { DiscountsService } from "src/services/discounts.service";
export declare class DiscountsController {
    private readonly discountService;
    constructor(discountService: DiscountsService);
    getDetails(discountsId: string): Promise<ApiResponseModel<Discounts>>;
    getPaginated(params: {
        pageSize: string;
        pageIndex: string;
        order: string;
        keywords: string;
    }): Promise<ApiResponseModel<{
        results: Discounts[];
        total: number;
    }>>;
    create(accessDto: CreateDiscountDto): Promise<ApiResponseModel<Discounts>>;
    update(discountsId: string, dto: UpdateDiscountDto): Promise<ApiResponseModel<Discounts>>;
    delete(discountsId: string): Promise<ApiResponseModel<Discounts>>;
}
