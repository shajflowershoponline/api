import { File } from "./File";
import { ProductCollection } from "./ProductCollection";
export declare class Collection {
    collectionId: string;
    sequenceId: string;
    name: string;
    desc: string;
    isSale: boolean;
    saleFromDate: Date | null;
    saleDueDate: Date | null;
    active: boolean | null;
    discountTagsIds: string | null;
    thumbnailFile: File;
    productCollections: ProductCollection[];
}
