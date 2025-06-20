import { CartItems } from "./CartItems";
import { CustomerCoupon } from "./CustomerCoupon";
import { CustomerUserAiSearch } from "./CustomerUserAiSearch";
import { CustomerUserWishlist } from "./CustomerUserWishlist";
import { Order } from "./Order";
export declare class CustomerUser {
    customerUserId: string;
    customerUserCode: string | null;
    name: string;
    email: string;
    password: string;
    currentOtp: string;
    isVerifiedUser: boolean;
    active: boolean;
    mobileNumber: string | null;
    address: string | null;
    addressCoordinates: object | null;
    addressLandmark: string | null;
    cartItems: CartItems[];
    customerCoupons: CustomerCoupon[];
    customerUserAiSearches: CustomerUserAiSearch[];
    customerUserWishlists: CustomerUserWishlist[];
    orders: Order[];
}
