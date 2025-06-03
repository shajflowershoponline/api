import { CreateProductCollectionDto } from "src/core/dto/product-collection/product-collection.create.dto";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { Repository } from "typeorm";
export declare class ProductCollectionService {
    private readonly collectionRepo;
    constructor(collectionRepo: Repository<ProductCollection>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: ProductCollection[];
        total: number;
    }>;
    getById(productCollectionId: any): Promise<ProductCollection>;
    create(dto: CreateProductCollectionDto): Promise<ProductCollection>;
    delete(productCollectionId: any): Promise<ProductCollection>;
}
