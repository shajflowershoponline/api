import { CartItems } from "./CartItems";
import { CustomerUserWishlist } from "./CustomerUserWishlist";
import { OrderItems } from "./OrderItems";
import { Category } from "./Category";
import { File } from "./File";
import { ProductCollection } from "./ProductCollection";
import { ProductImage } from "./ProductImage";
export declare class Product {
    productId: string;
    sku: string | null;
    name: string;
    shortDesc: string;
    price: string;
    size: string;
    longDesc: string;
    active: boolean;
    color: string | null;
    giftAddOnsAvailable: string | null;
    discountTagsIds: string | null;
    interested: string | null;
    cartItems: CartItems[];
    customerUserWishlists: CustomerUserWishlist[];
    orderItems: OrderItems[];
    category: Category;
    thumbnailFile: File;
    productCollections: ProductCollection[];
    productImages: ProductImage[];
}
