import { CreateDiscountDto } from "src/core/dto/discounts/discounts.create.dto";
import { UpdateDiscountDto } from "src/core/dto/discounts/discounts.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Discounts } from "src/db/entities/Discounts";
import { Repository } from "typeorm";
export declare class DiscountsService {
    private firebaseProvider;
    private readonly discountRepo;
    constructor(firebaseProvider: FirebaseProvider, discountRepo: Repository<Discounts>);
    getPagination({ pageSize, pageIndex, order, keywords }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        keywords: any;
    }): Promise<{
        results: Discounts[];
        total: number;
    }>;
    getById(discountId: any): Promise<Discounts>;
    create(dto: CreateDiscountDto): Promise<Discounts>;
    update(discountId: any, dto: UpdateDiscountDto): Promise<Discounts>;
    delete(discountId: any): Promise<Discounts>;
}
