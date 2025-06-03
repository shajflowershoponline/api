import { Order } from "./Order";
import { Product } from "./Product";
export declare class OrderItems {
    orderItemId: string;
    quantity: string;
    price: string;
    totalAmount: string;
    active: boolean;
    order: Order;
    product: Product;
}
