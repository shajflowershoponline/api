import { CreateCustomerUserWishlistDto } from "src/core/dto/customer-user-wish-list/customer-user-wish-list.create.dto";
import { CustomerUserWishlist } from "src/db/entities/CustomerUserWishlist";
import { Repository } from "typeorm";
export declare class CustomerUserWishListService {
    private readonly customerUserWishlistRepo;
    constructor(customerUserWishlistRepo: Repository<CustomerUserWishlist>);
    getPagination({ customerUserId, pageSize, pageIndex, order, keywords, }: {
        customerUserId: any;
        pageSize: any;
        pageIndex: any;
        order: any;
        keywords: any;
    }): Promise<{
        results: CustomerUserWishlist[];
        total: number;
    }>;
    getById(customerUserWishlistId: any): Promise<CustomerUserWishlist>;
    getBySKU(customerUserId: any, sku: any): Promise<CustomerUserWishlist>;
    create(dto: CreateCustomerUserWishlistDto): Promise<CustomerUserWishlist>;
    delete(customerUserWishlistId: any): Promise<CustomerUserWishlist>;
}
