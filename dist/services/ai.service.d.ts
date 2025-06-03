import { HttpService } from "@nestjs/axios";
import { Repository } from "typeorm";
import { Product } from "../db/entities/Product";
import { Category } from "../db/entities/Category";
import { Collection } from "../db/entities/Collection";
import { ProductCollection } from "../db/entities/ProductCollection";
import { OrderItems } from "../db/entities/OrderItems";
import { CartItems } from "../db/entities/CartItems";
import { CustomerUserWishlist } from "../db/entities/CustomerUserWishlist";
import { ConfigService } from "@nestjs/config";
export declare class AIService {
    private readonly config;
    private readonly httpService;
    private readonly productRepository;
    private readonly categoryRepository;
    private readonly collectionRepository;
    private readonly productCollectionRepository;
    private readonly orderItemsRepository;
    private readonly cartItemsRepository;
    private readonly wishlistRepository;
    constructor(config: ConfigService, httpService: HttpService, productRepository: Repository<Product>, categoryRepository: Repository<Category>, collectionRepository: Repository<Collection>, productCollectionRepository: Repository<ProductCollection>, orderItemsRepository: Repository<OrderItems>, cartItemsRepository: Repository<CartItems>, wishlistRepository: Repository<CustomerUserWishlist>);
    private buildPrompt;
    handleSearch(userQuery: string): Promise<{
        results: any;
        params: any;
    }>;
    private listCategories;
    private listCollections;
    private listColors;
    private searchProducts;
    private generateSuggestionsHybridAndNonHybrid;
    private listTrends;
}
