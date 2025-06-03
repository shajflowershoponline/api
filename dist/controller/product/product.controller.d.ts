import { CreateProductDto } from "src/core/dto/product/product.create.dto";
import { UpdateProductDto } from "src/core/dto/product/product.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Product } from "src/db/entities/Product";
import { ProductService } from "src/services/product.service";
import { Category } from "src/db/entities/Category";
import { Collection } from "src/db/entities/Collection";
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getDetails(sku: string): Promise<ApiResponseModel<Product>>;
    getPagination(params: {
        pageSize: string;
        pageIndex: string;
        order: any;
        customerUserId: string;
        columnDef: {
            apiNotation: string;
            filter?: string;
            name: string;
            type?: string;
        }[];
    }): Promise<ApiResponseModel<{
        results: Product[];
        total: number;
    }>>;
    getSearchFilter(params: {
        columnDef: {
            apiNotation: string;
            filter?: string;
            name: string;
            type?: string;
        }[];
    }): Promise<ApiResponseModel<{
        categories: Category[];
        collections: Collection[];
    }>>;
    create(accessDto: CreateProductDto): Promise<ApiResponseModel<Product>>;
    batchUpdateDiscountPrice(dto: {
        skus: string;
    }): Promise<ApiResponseModel<Product[]>>;
    update(sku: string, dto: UpdateProductDto): Promise<ApiResponseModel<Product>>;
    delete(sku: string): Promise<ApiResponseModel<Product>>;
}
