export declare class ProductImageDto {
    guid: string;
    fileName: string;
    base64: string;
    noChanges: boolean;
    sequenceId: string;
}
export declare class DefaultProductDto {
    name: string;
    shortDesc: string;
    longDesc: string;
    price: string;
    color: string;
    size: number;
    categoryId: string;
    updateImage: boolean;
    productImages: ProductImageDto[];
    giftAddOnsAvailable: string[];
    discountTagsIds: string[];
}
