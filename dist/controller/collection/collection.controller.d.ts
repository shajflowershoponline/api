import { CreateCollectionDto } from "src/core/dto/collection/collection.create.dto";
import { UpdateCollectionOrderDto } from "src/core/dto/collection/collection.update-order.dto";
import { UpdateCollectionDto } from "src/core/dto/collection/collection.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Collection } from "src/db/entities/Collection";
import { CollectionService } from "src/services/collection.service";
export declare class CollectionController {
    private readonly collectionService;
    constructor(collectionService: CollectionService);
    getById(collectionId: string): Promise<ApiResponseModel<Collection>>;
    getPaginated(params?: {
        pageSize: string;
        pageIndex: string;
        order: any;
        keywords: string;
    }): Promise<ApiResponseModel<{
        results: Collection[];
        total: number;
    }>>;
    create(accessDto: CreateCollectionDto): Promise<ApiResponseModel<Collection>>;
    updateOrder(dto: UpdateCollectionOrderDto[]): Promise<ApiResponseModel<Collection[]>>;
    update(collectionId: string, dto: UpdateCollectionDto): Promise<ApiResponseModel<Collection>>;
    updateFeatured(collectionId: string, dto?: {
        isFeatured: boolean;
    }): Promise<ApiResponseModel<Collection>>;
    delete(collectionId: string): Promise<ApiResponseModel<Collection>>;
}
