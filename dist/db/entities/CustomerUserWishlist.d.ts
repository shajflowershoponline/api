import { CustomerUser } from "./CustomerUser";
import { Product } from "./Product";
export declare class CustomerUserWishlist {
    customerUserWishlistId: string;
    customerUserId: string;
    productId: string;
    dateTime: Date;
    customerUser: CustomerUser;
    product: Product;
}
