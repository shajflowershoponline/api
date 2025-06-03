import { CreateCollectionDto } from "src/core/dto/collection/collection.create.dto";
import { UpdateCollectionDto } from "src/core/dto/collection/collection.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Collection } from "src/db/entities/Collection";
import { ProductCollection } from "src/db/entities/ProductCollection";
import { Repository } from "typeorm";
import { File } from "src/db/entities/File";
import { UpdateCollectionOrderDto } from "src/core/dto/collection/collection.update-order.dto";
import { Discounts } from "src/db/entities/Discounts";
export declare class CollectionService {
    private firebaseProvider;
    private readonly collectionRepo;
    constructor(firebaseProvider: FirebaseProvider, collectionRepo: Repository<Collection>);
    getPagination({ pageSize, pageIndex, order, keywords }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        keywords: any;
    }): Promise<{
        results: any[];
        total: number;
    }>;
    getById(collectionId: any): Promise<{
        productCount: number;
        selectedDiscounts: Discounts[];
        collectionId: string;
        sequenceId: string;
        name: string;
        desc: string;
        isSale: boolean;
        saleFromDate: Date;
        saleDueDate: Date;
        active: boolean;
        discountTagsIds: string;
        thumbnailFile: File;
        productCollections: ProductCollection[];
    }>;
    create(dto: CreateCollectionDto): Promise<Collection>;
    update(collectionId: any, dto: UpdateCollectionDto): Promise<Collection>;
    updateOrder(dtos: UpdateCollectionOrderDto[]): Promise<Collection[]>;
    delete(collectionId: any): Promise<Collection>;
}
