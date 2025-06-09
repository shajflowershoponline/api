import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { CreateProductDto } from "src/core/dto/product/product.create.dto";
import { UpdateProductDto } from "src/core/dto/product/product.update.dto";
import { Category } from "src/db/entities/Category";
import { Product } from "src/db/entities/Product";
import { Repository } from "typeorm";
import { File } from "src/db/entities/File";
import { ProductImage } from "src/db/entities/ProductImage";
import { GiftAddOns } from "src/db/entities/GiftAddOns";
import { Discounts } from "src/db/entities/Discounts";
import { Collection } from "src/db/entities/Collection";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { CustomerUserWishlist } from "src/db/entities/CustomerUserWishlist";
export declare class ProductService {
    private firebaseProvider;
    private readonly productRepo;
    constructor(firebaseProvider: FirebaseProvider, productRepo: Repository<Product>);
    advancedSearchProductIds(query: string): Promise<string[]>;
    getClientPagination({ pageSize, pageIndex, order, columnDef, customerUserId, keyword, }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
        customerUserId: any;
        keyword: any;
    }): Promise<{
        results: Product[];
        total: number;
    }>;
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Product[];
        total: number;
    }>;
    getSearchFilter({ columnDef }: {
        columnDef: any;
    }): Promise<{
        colors: {
            name: string;
            count: number;
        }[];
        categories: Category[];
        collections: Collection[];
    }>;
    getBySku(sku: any): Promise<{
        selectedGiftAddOns: GiftAddOns[];
        selectedDiscounts: Discounts[];
        productId: string;
        sku: string;
        name: string;
        shortDesc: string;
        price: string;
        size: string;
        longDesc: string;
        active: boolean;
        color: string;
        giftAddOnsAvailable: string;
        discountTagsIds: string;
        interested: string;
        cartItems: import("../db/entities/CartItems").CartItems[];
        customerUserWishlists: CustomerUserWishlist[];
        orderItems: import("../db/entities/OrderItems").OrderItems[];
        category: Category;
        thumbnailFile: File;
        productCollections: ProductCollection[];
        productImages: ProductImage[];
    }>;
    getAllFeaturedProducts(customerUserId: any): Promise<Product[]>;
    create(dto: CreateProductDto): Promise<Product>;
    update(sku: any, dto: UpdateProductDto): Promise<Product>;
    delete(sku: any): Promise<Product>;
}
