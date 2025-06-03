import { File } from "./File";
import { Product } from "./Product";
export declare class Category {
    categoryId: string;
    sequenceId: string;
    name: string;
    desc: string;
    active: boolean;
    thumbnailFile: File;
    products: Product[];
}
