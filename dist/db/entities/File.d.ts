import { Category } from "./Category";
import { Collection } from "./Collection";
import { Discounts } from "./Discounts";
import { GiftAddOns } from "./GiftAddOns";
import { Product } from "./Product";
import { ProductImage } from "./ProductImage";
export declare class File {
    fileId: string;
    fileName: string;
    url: string | null;
    guid: string;
    categories: Category[];
    collections: Collection[];
    discounts: Discounts[];
    giftAddOns: GiftAddOns[];
    products: Product[];
    productImages: ProductImage[];
}
