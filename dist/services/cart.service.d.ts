import { CartCustomerCouponDto } from "src/core/dto/cart-item/cart-customer-coupon.dto";
import { CreateCartItemDto } from "src/core/dto/cart-item/cart-item.create.dto";
import { UpdateCartDto } from "src/core/dto/cart-item/cart-item.update.dto";
import { CartItems } from "src/db/entities/CartItems";
import { CustomerCoupon } from "src/db/entities/CustomerCoupon";
import { Repository } from "typeorm";
export declare class CartService {
    private readonly cartItemsRepo;
    constructor(cartItemsRepo: Repository<CartItems>);
    getItems(customerUserId: any): Promise<CartItems[]>;
    create(dto: CreateCartItemDto): Promise<CartItems>;
    update(dto: UpdateCartDto): Promise<CartItems[]>;
    manageCoupon(dto: CartCustomerCouponDto): Promise<CustomerCoupon>;
    getActiveCoupon(customerUserId: any): Promise<CustomerCoupon>;
}
