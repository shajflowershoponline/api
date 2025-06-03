import { CreateCategoryDto } from "src/core/dto/category/category.create.dto";
import { UpdateCategoryOrderDto } from "src/core/dto/category/category.update-order.dto";
import { UpdateCategoryDto } from "src/core/dto/category/category.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Category } from "src/db/entities/Category";
import { Product } from "src/db/entities/Product";
import { Repository } from "typeorm";
import { File } from "src/db/entities/File";
export declare class CategoryService {
    private firebaseProvider;
    private readonly categoryRepo;
    constructor(firebaseProvider: FirebaseProvider, categoryRepo: Repository<Category>);
    getPagination({ pageSize, pageIndex, order, keywords }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        keywords: any;
    }): Promise<{
        results: any[];
        total: number;
    }>;
    getById(categoryId: any): Promise<{
        productCount: number;
        categoryId: string;
        sequenceId: string;
        name: string;
        desc: string;
        active: boolean;
        thumbnailFile: File;
        products: Product[];
    }>;
    create(dto: CreateCategoryDto): Promise<Category>;
    update(categoryId: any, dto: UpdateCategoryDto): Promise<Category>;
    updateOrder(dtos: UpdateCategoryOrderDto[]): Promise<Category[]>;
    delete(categoryId: any): Promise<Category>;
}
