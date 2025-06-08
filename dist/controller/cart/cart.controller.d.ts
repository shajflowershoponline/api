import { CartCustomerCouponDto } from "src/core/dto/cart-item/cart-customer-coupon.dto";
import { CreateCartItemDto } from "src/core/dto/cart-item/cart-item.create.dto";
import { UpdateCartDto } from "src/core/dto/cart-item/cart-item.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { CartItems } from "src/db/entities/CartItems";
import { Collection } from "src/db/entities/Collection";
import { CustomerCoupon } from "src/db/entities/CustomerCoupon";
import { CartService } from "src/services/cart.service";
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getItems(customerUserId: string): Promise<ApiResponseModel<{
        results: CartItems[];
        activeCoupon: CustomerCoupon;
        collections: Collection[];
    }>>;
    create(dto: CreateCartItemDto): Promise<ApiResponseModel<CartItems>>;
    update(dto: UpdateCartDto): Promise<ApiResponseModel<CartItems[]>>;
    manageCoupon(dto: CartCustomerCouponDto): Promise<ApiResponseModel<CustomerCoupon>>;
    getActiveCoupon(customerUserId: string): Promise<ApiResponseModel<CustomerCoupon>>;
}
