import { CustomerCoupon } from "./CustomerCoupon";
import { File } from "./File";
export declare class Discounts {
    discountId: string;
    promoCode: string;
    description: string | null;
    type: string;
    value: string;
    active: boolean;
    customerCoupons: CustomerCoupon[];
    thumbnailFile: File;
}
