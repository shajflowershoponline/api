import { CreateProductCollectionDto } from "src/core/dto/product-collection/product-collection.create.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { ProductCollectionService } from "src/services/product-collection.service";
export declare class ProductCollectionController {
    private readonly collectionService;
    constructor(collectionService: ProductCollectionService);
    getById(productCollectionId: string): Promise<ApiResponseModel<ProductCollection>>;
    getPagination(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: ProductCollection[];
        total: number;
    }>>;
    create(accessDto: CreateProductCollectionDto): Promise<ApiResponseModel<ProductCollection>>;
    delete(collectionId: string): Promise<ApiResponseModel<ProductCollection>>;
}
