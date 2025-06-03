import { CustomerUser } from "./CustomerUser";
import { Discounts } from "./Discounts";
export declare class CustomerCoupon {
    customerCouponId: string;
    createdDate: Date;
    active: boolean;
    customerUser: CustomerUser;
    discount: Discounts;
}
