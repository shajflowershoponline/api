import { CreateCustomerUserWishlistDto } from "src/core/dto/customer-user-wish-list/customer-user-wish-list.create.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { CustomerUserWishlist } from "src/db/entities/CustomerUserWishlist";
import { CustomerUserWishListService } from "src/services/customer-user-wish-list.service";
export declare class CustomerUserWishListController {
    private readonly customerUserWishlistService;
    constructor(customerUserWishlistService: CustomerUserWishListService);
    getDetails(customerUserWishlistId: string): Promise<ApiResponseModel<CustomerUserWishlist>>;
    getBySKU(customerUserId: string, sku: string): Promise<ApiResponseModel<CustomerUserWishlist>>;
    getPaginated(params: {
        customerUserId: string;
        pageSize: string;
        pageIndex: string;
        order: string;
        keywords: string;
    }): Promise<ApiResponseModel<{
        results: CustomerUserWishlist[];
        total: number;
    }>>;
    create(accessDto: CreateCustomerUserWishlistDto): Promise<ApiResponseModel<CustomerUserWishlist>>;
    delete(customerUserWishlistId: string): Promise<ApiResponseModel<CustomerUserWishlist>>;
}
