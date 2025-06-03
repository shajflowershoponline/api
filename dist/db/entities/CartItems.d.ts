import { CustomerUser } from "./CustomerUser";
import { Product } from "./Product";
export declare class CartItems {
    cartItemId: string;
    createdAt: Date;
    updatedAt: Date | null;
    quantity: string;
    price: string;
    active: boolean;
    customerUser: CustomerUser;
    product: Product;
}
