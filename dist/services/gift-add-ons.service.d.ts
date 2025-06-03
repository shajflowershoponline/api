import { CreateGiftAddOnDto } from "src/core/dto/gift-add-ons/gift-add-ons.create.dto";
import { UpdateGiftAddOnDto } from "src/core/dto/gift-add-ons/gift-add-ons.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { GiftAddOns } from "src/db/entities/GiftAddOns";
import { Repository } from "typeorm";
export declare class GiftAddOnsService {
    private firebaseProvider;
    private readonly giftAddOnRepo;
    constructor(firebaseProvider: FirebaseProvider, giftAddOnRepo: Repository<GiftAddOns>);
    getPagination({ pageSize, pageIndex, order, keywords }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        keywords: any;
    }): Promise<{
        results: GiftAddOns[];
        total: number;
    }>;
    getById(giftAddOnId: any): Promise<GiftAddOns>;
    create(dto: CreateGiftAddOnDto): Promise<GiftAddOns>;
    update(giftAddOnId: any, dto: UpdateGiftAddOnDto): Promise<GiftAddOns>;
    delete(giftAddOnId: any): Promise<GiftAddOns>;
}
