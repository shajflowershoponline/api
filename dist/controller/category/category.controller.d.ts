import { CreateCategoryDto } from "src/core/dto/category/category.create.dto";
import { UpdateCategoryOrderDto } from "src/core/dto/category/category.update-order.dto";
import { UpdateCategoryDto } from "src/core/dto/category/category.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Category } from "src/db/entities/Category";
import { CategoryService } from "src/services/category.service";
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getDetails(categoryId: string): Promise<ApiResponseModel<Category>>;
    getPaginated(params?: {
        pageSize: string;
        pageIndex: string;
        order: any;
        keywords: string;
    }): Promise<ApiResponseModel<{
        results: Category[];
        total: number;
    }>>;
    create(accessDto: CreateCategoryDto): Promise<ApiResponseModel<Category>>;
    updateOrder(dto: UpdateCategoryOrderDto[]): Promise<ApiResponseModel<Category[]>>;
    update(categoryId: string, dto: UpdateCategoryDto): Promise<ApiResponseModel<Category>>;
    delete(categoryId: string): Promise<ApiResponseModel<Category>>;
}
