"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Product_1 = require("../db/entities/Product");
const Category_1 = require("../db/entities/Category");
const Collection_1 = require("../db/entities/Collection");
const ProductCollection_1 = require("../db/entities/ProductCollection");
const OrderItems_1 = require("../db/entities/OrderItems");
const CartItems_1 = require("../db/entities/CartItems");
const CustomerUserWishlist_1 = require("../db/entities/CustomerUserWishlist");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let AIService = class AIService {
    constructor(config, httpService, productRepository, categoryRepository, collectionRepository, productCollectionRepository, orderItemsRepository, cartItemsRepository, wishlistRepository) {
        this.config = config;
        this.httpService = httpService;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.collectionRepository = collectionRepository;
        this.productCollectionRepository = productCollectionRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.wishlistRepository = wishlistRepository;
    }
    async buildPrompt(userQuery) {
        const categoryNames = this.config.get("FLOWER_TYPES");
        return `
    You are a smart AI search assistant for an online flower shop.
    
    When classifying and generating structured data, strictly follow:
    
    - "category": MUST only be from these values: [${categoryNames}]
    - "productName": is the product title like "White Rose Bouquet"
    - "collections": like "Valentines", "Birthday", etc.
    - "color": valid flower colors
    - "giftAddOnsAvailable", "discountTags" are arrays of strings
    - "price", "maxPrice", "minPrice": MUST be direct numbers (not JSON objects)
    
    ---
        
    Follow STRICT rules for intent detection:

    -list_categories: If user mentions keywords like "types", "type", "category", "categories", "species", "kind", "kinds" of flower (e.g., "best type of flower for valentine's","best category of flower for valentine's","best categories","what is the best flower species","what is best flower types","categories for birthday","species for christmas") then its list_categories and not search_product.
    -list_collections: If user mentions keywords "collection", "collections", "seasonal", "seasons", "groups" of flowers (e.g., "collections for valentines","other seasonal groups for birthday") then its list_collections and not search_product or not list_categories.
    -search_product: If user mentions keywords specific flower names like "rose", "sunflower", "tulip", "orchid", etc or just says "flower" without asking types or categories (e.g.,"best flower for valentines","best rose for birthday") then its search_product and not list_categories or not list_collections.
    -list_trend: If user mentions keywords "what is popular", "what is trending", "best sellers", "most ordered", etc (no specific product or category)
    -invalid_query: If completely unrelated to flowers or shop or if not about flowers, shopping, or bouquets.

    ---
    
    Important rules:
    - NEVER output price as { "lte": 700 }. Only use numbers like "price": 700.
    - If user says "under 700", use "maxPrice": 700.
    - If user says "over 500", use "minPrice": 500.
    ---

    Order Preferences Detection:

    - User might ask to "order by price", "cheapest first", "most likes", "most wishlists".
    - If detected, output "orderBy" field with one of:
    - "price_asc", "price_desc", "wishlist_desc", "popularity_desc", "popularity_asc"

    📦 Output JSON Formats:

    ▶ If intent = **search_product**:
    \`\`\`json
    {
      "intent": "search_product",
      "data": {
        "productName": "White Rose Bouquet",
        "category": "Rose",
        "collections": ["Valentines"],
        "color": ["White"],
        "price": 1999,
        "maxPrice": 700,
        "minPrice": 0,
        "giftAddOnsAvailable": ["Chocolates"],
        "discountTags": ["Best Seller"]
      }
    }
    \`\`\`
    
    ---
    
    ▶ If intent = **list_trend**:
    \`\`\`json
    {
      "intent": "list_trend",
      "orderBy": "price" | "popularity_score" | "order_count",
      "orderDirection": "asc" | "desc"
    }
    \`\`\`
    (orderBy and orderDirection are optional; include only if user specifies)
    
    ---
    
    ▶ If intent = **list_categories**:
    \`\`\`json
    {
      "intent": "list_categories",
      "data": {
        "occasions": ["Valentines"], // OPTIONAL
        "collections": ["Valentines"], // OPTIONAL
        "tags": ["Valentines", "Birthday", "Rose"], // OPTIONAL
        "maxPrice": 700,// OPTIONAL
        "minPrice": 0,// OPTIONAL
      },
      "orderBy": "price" | "popularity_score" | "order_count", // OPTIONAL
      "orderDirection": "asc" | "desc" // OPTIONAL
    }
    \`\`\`
    - If user specifies occasion like "Valentines", include collection.
    - If user specifies the color like "what category of flower that has red color" (eg. "Rose", "Chrysanthemums", "Geraniums", "Chrysanthemums", "Poinsettias" etc.).
    - If user specifies the color like "what type of flower that has yellow color" (eg. "Rose", "Sunflower"etc.).
    - If user specifies the collection like "what category of flower that is good for Valentines" or "what category of flower that is good for Valentines" (eg. "Rose", "Carnations", "Tulips", "Orchids", "Calla lilies" etc.).
    - If user specifies the collection like "what category of flower that is good for Birthday" or "what is the best type of flower for Birthday" (eg. "Rose", "Sunflower", "Lilies", "Orchids", "Gladiolus " etc.).
    - If user specifies the collection like "what is the best type of flower for summer" or "what category of flower that is good for summer" (eg. "Rose", "Sunflower", "Lavender", "Daisies" etc.).
    - If user specifies ordering like "cheapest first", "most popular first", include orderBy + orderDirection.

    ---
    
    ▶ If intent = **list_collections**:
    \`\`\`json
    {
      "intent": "list_collections",
      "data": {
        "occasions": ["Valentines"], // OPTIONAL
        "collections": ["Valentines"], // OPTIONAL
        "categories": ["rose", "sunflower"], // OPTIONAL
        "tags": ["Valentines", "Rose"], // OPTIONAL
        "maxPrice": 700,// OPTIONAL
        "minPrice": 0,// OPTIONAL
      },
      "orderBy": "price" | "popularity_score" | "order_count", // OPTIONAL
      "orderDirection": "asc" | "desc" // OPTIONAL
    }
    \`\`\`
    - If user specifies occasion like "Valentines", include collection.
    - If user specifies the category like "what collections does rose and sunflower have".
    - If user specifies the collection like "what collections does rose have".
    - If user specifies the alternative collection like "what alternative collections that is simar to anniversary".
    - If user specifies the alternative collection like "what alternative collections that is simar to monthsary".
    - If user specifies ordering like "cheapest first", "most popular first", include orderBy + orderDirection.

    ---
    
    ▶ If intent = **list_colors**:
    \`\`\`json
    {
      "intent": "list_colors",
      "data": {
        "occasions": ["Valentines"], // OPTIONAL
        "collections": ["Valentines"], // OPTIONAL
        "categories": ["rose", "sunflower"], // OPTIONAL
        "tags": ["rose", "sunflower", "Valentines"], // OPTIONAL
        "maxPrice": 700, // OPTIONAL
        "minPrice": 0, // OPTIONAL
      },
      "orderBy": "price" | "popularity_score" | "order_count", // OPTIONAL
      "orderDirection": "asc" | "desc" // OPTIONAL
    }
    \`\`\`
    - If user specifies occasion like "Valentines", include collection.
    - If user specifies the category like "what color does rose and sunflower have".
    - If user specifies the category like "what popular color does tulips have".

    ---
    
    ▶ If intent = **invalid_query**:
    \`\`\`json
    {
      "intent": "invalid_query"
    }
    \`\`\`
    
    ---
    
    🚨 Very Important Behavior:
    
    - If user asks for "best flower for Valentine's Day" → **search_product**, NOT list_categories.
    - Only detect **list_categories** if asking for "types", "categories", "flower species" themselves.
    - Do NOT confuse flower "event gift" with "flower type listing".
    
    ---
    
    🛡️ Safe Defaults:
    - If unsure about orderBy/orderDirection, you can omit it.
    - If unsure about collectionName, you can omit it.
    
    ---
    User Query: ${userQuery}
    `;
    }
    async handleSearch(userQuery) {
        const prompt = await this.buildPrompt(userQuery);
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.config.get("GROQ_API_URL"), {
            model: "llama3-70b-8192",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: userQuery },
            ],
            temperature: 0.0,
            max_tokens: 800,
        }, {
            headers: {
                "Accept-Encoding": "gzip, deflate",
                Authorization: `Bearer ${this.config.get("GROQ_API_KEY")}`,
                "Content-Type": "application/json",
            },
        }));
        const aiMessage = response.data.choices[0].message.content;
        console.log(aiMessage);
        let aiResult;
        try {
            const firstCurly = aiMessage.indexOf("{");
            const lastCurly = aiMessage.lastIndexOf("}");
            if (firstCurly === -1 || lastCurly === -1) {
                throw new Error("No JSON block detected in AI output.");
            }
            const cleanJson = aiMessage.slice(firstCurly, lastCurly + 1).trim();
            aiResult = JSON.parse(cleanJson);
        }
        catch (err) {
            console.error("Parse Error:", err.message);
            throw new Error("Failed to parse AI output safely.");
        }
        const { intent, data, orderBy, orderDirection } = aiResult;
        let results = null;
        if (intent === "search_product") {
            results = await this.searchProducts(data);
        }
        else if (intent === "list_categories") {
            results = await this.listCategories(Object.assign(Object.assign({}, data), { orderBy, orderDirection }));
        }
        else if (intent === "list_collections") {
            results = await this.listCollections(Object.assign(Object.assign({}, data), { orderBy,
                orderDirection }));
        }
        else if (intent === "list_colors") {
            results = await this.listColors(Object.assign(Object.assign({}, data), { orderBy, orderDirection }));
        }
        else if (intent === "list_trend") {
            results = await this.listTrends();
        }
        else {
            throw Error("Sorry, I can only assist you with flowers, bouquets, categories, collections, or colors. Please rephrase your question!");
        }
        return {
            results,
            params: aiResult,
        };
    }
    async listCategories(data) {
        var _a, _b, _c, _d, _e, _f;
        const qb = this.categoryRepository
            .createQueryBuilder("category")
            .leftJoin("category.products", "product")
            .leftJoin("product.productCollections", "productCollection")
            .leftJoin("productCollection.collection", "collection")
            .where('category."Active" = true');
        if (((_a = data === null || data === void 0 ? void 0 : data.collections) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            qb.andWhere('collection."Name" IN (:...collections)', {
                collections: data.collections,
            });
        }
        if (((_b = data === null || data === void 0 ? void 0 : data.occasions) === null || _b === void 0 ? void 0 : _b.length) > 0 || ((_c = data === null || data === void 0 ? void 0 : data.tags) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            const tags = [...(data.occasions || []), ...(data.tags || [])];
            qb.andWhere('collection."Name" IN (:...tags)', { tags });
        }
        if (data === null || data === void 0 ? void 0 : data.minPrice) {
            qb.andWhere('product."Price" >= :minPrice', { minPrice: data.minPrice });
        }
        if (data === null || data === void 0 ? void 0 : data.maxPrice) {
            qb.andWhere('product."Price" <= :maxPrice', { maxPrice: data.maxPrice });
        }
        if ((data === null || data === void 0 ? void 0 : data.orderBy) === "price") {
            qb.addSelect('MIN(product."Price")', "price")
                .groupBy('category."CategoryId"')
                .addGroupBy('category."Name"')
                .orderBy("price", ((_d = data.orderDirection) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || "ASC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "popularity_score") {
            qb.addSelect(`(SELECT COUNT(*) FROM "CartItems" cart WHERE cart."ProductId" = product."ProductId") + (SELECT COUNT(*) FROM "CustomerUserWishlist" wish WHERE wish."ProductId" = product."ProductId")`, "popularityScore")
                .groupBy('category."CategoryId"')
                .addGroupBy('category."Name"')
                .orderBy("popularityScore", ((_e = data.orderDirection) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || "DESC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "order_count") {
            qb.addSelect(`(SELECT SUM(orderItem."Quantity") FROM "OrderItems" orderItem WHERE orderItem."ProductId" = product."ProductId")`, "orderCount")
                .groupBy('category."CategoryId"')
                .addGroupBy('category."Name"')
                .orderBy("orderCount", ((_f = data.orderDirection) === null || _f === void 0 ? void 0 : _f.toUpperCase()) || "DESC");
        }
        else {
            qb.groupBy('category."CategoryId"')
                .addGroupBy('category."Name"')
                .orderBy('category."SequenceId"', "ASC");
        }
        const categories = await qb.getRawMany();
        return { categories: categories.map((c) => c.category_name || c.name) };
    }
    async listCollections(data) {
        var _a, _b, _c, _d, _e, _f;
        const qb = this.collectionRepository
            .createQueryBuilder("collection")
            .leftJoin("collection.productCollections", "productCollection")
            .leftJoin("productCollection.product", "product")
            .where('collection."Active" = true');
        if (((_a = data === null || data === void 0 ? void 0 : data.categories) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            qb.andWhere('product."CategoryId" IN (:...categories)', {
                categories: data.categories,
            });
        }
        if (((_b = data === null || data === void 0 ? void 0 : data.occasions) === null || _b === void 0 ? void 0 : _b.length) > 0 || ((_c = data === null || data === void 0 ? void 0 : data.tags) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            const tags = [...(data.occasions || []), ...(data.tags || [])];
            qb.andWhere('collection."Name" IN (:...tags)', { tags });
        }
        if (data === null || data === void 0 ? void 0 : data.minPrice) {
            qb.andWhere('product."Price" >= :minPrice', { minPrice: data.minPrice });
        }
        if (data === null || data === void 0 ? void 0 : data.maxPrice) {
            qb.andWhere('product."Price" <= :maxPrice', { maxPrice: data.maxPrice });
        }
        if ((data === null || data === void 0 ? void 0 : data.orderBy) === "price") {
            qb.addSelect('MIN(product."Price")', "price")
                .groupBy('collection."CollectionId"')
                .addGroupBy('collection."Name"')
                .orderBy("price", ((_d = data.orderDirection) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || "ASC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "popularity_score") {
            qb.addSelect(`(SELECT COUNT(*) FROM "CartItems" cart WHERE cart."ProductId" = product."ProductId") + (SELECT COUNT(*) FROM "CustomerUserWishlist" wish WHERE wish."ProductId" = product."ProductId")`, "popularityScore")
                .groupBy('collection."CollectionId"')
                .addGroupBy('collection."Name"')
                .orderBy("popularityScore", ((_e = data.orderDirection) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || "DESC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "order_count") {
            qb.addSelect(`(SELECT SUM(orderItem."Quantity") FROM "OrderItems" orderItem WHERE orderItem."ProductId" = product."ProductId")`, "orderCount")
                .groupBy('collection."CollectionId"')
                .addGroupBy('collection."Name"')
                .orderBy("orderCount", ((_f = data.orderDirection) === null || _f === void 0 ? void 0 : _f.toUpperCase()) || "DESC");
        }
        else {
            qb.groupBy('collection."CollectionId"')
                .addGroupBy('collection."Name"')
                .orderBy('collection."SequenceId"', "ASC");
        }
        const collections = await qb.getRawMany();
        return { collections: collections.map((c) => c.collection_name || c.name) };
    }
    async listColors(data) {
        var _a, _b, _c, _d, _e, _f, _g;
        const qb = this.productRepository
            .createQueryBuilder("product")
            .leftJoin("product.productCollections", "productCollection")
            .leftJoin("productCollection.collection", "collection")
            .leftJoin("product.category", "category")
            .where('product."Active" = true')
            .andWhere('product."Color" IS NOT NULL');
        if (((_a = data === null || data === void 0 ? void 0 : data.collections) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            qb.andWhere('collection."Name" IN (:...collections)', {
                collections: data.collections,
            });
        }
        if (((_b = data === null || data === void 0 ? void 0 : data.categories) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            qb.andWhere('category."Name" IN (:...categories)', {
                categories: data.categories,
            });
        }
        if (((_c = data === null || data === void 0 ? void 0 : data.tags) === null || _c === void 0 ? void 0 : _c.length) > 0 || ((_d = data === null || data === void 0 ? void 0 : data.occasions) === null || _d === void 0 ? void 0 : _d.length) > 0) {
            const tags = [...(data.tags || []), ...(data.occasions || [])];
            qb.andWhere('collection."Name" IN (:...tags)', { tags });
        }
        if (data === null || data === void 0 ? void 0 : data.minPrice) {
            qb.andWhere('product."Price" >= :minPrice', { minPrice: data.minPrice });
        }
        if (data === null || data === void 0 ? void 0 : data.maxPrice) {
            qb.andWhere('product."Price" <= :maxPrice', { maxPrice: data.maxPrice });
        }
        if ((data === null || data === void 0 ? void 0 : data.orderBy) === "price") {
            qb.addSelect('MIN(product."Price")', "price")
                .groupBy('product."Color"')
                .orderBy("price", ((_e = data.orderDirection) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || "ASC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "popularity_score") {
            qb.addSelect(`(SELECT COUNT(*) FROM "CartItems" cart WHERE cart."ProductId" = product."ProductId") + (SELECT COUNT(*) FROM "CustomerUserWishlist" wish WHERE wish."ProductId" = product."ProductId")`, "popularityScore")
                .groupBy('product."Color"')
                .orderBy("popularityScore", ((_f = data.orderDirection) === null || _f === void 0 ? void 0 : _f.toUpperCase()) || "DESC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "order_count") {
            qb.addSelect(`(SELECT SUM(orderItem."Quantity") FROM "OrderItems" orderItem WHERE orderItem."ProductId" = product."ProductId")`, "orderCount")
                .groupBy('product."Color"')
                .orderBy("orderCount", ((_g = data.orderDirection) === null || _g === void 0 ? void 0 : _g.toUpperCase()) || "DESC");
        }
        else {
            qb.groupBy('product."Color"');
        }
        const colorsResult = await qb.getRawMany();
        return {
            colors: colorsResult.map((c) => c.color),
        };
    }
    async searchProducts(data) {
        const condition = { active: true };
        if (data.productName) {
            condition.name = (0, typeorm_2.ILike)(`%${data.productName}%`);
        }
        if (data.category) {
            condition.category = { name: (0, typeorm_2.ILike)(`%${data.category}%`) };
        }
        if (data.price) {
            condition.price = data.price;
        }
        if (data.maxPrice) {
            condition.price = Object.assign(Object.assign({}, (condition.price || {})), { lte: data.maxPrice });
        }
        if (data.minPrice) {
            condition.price = Object.assign(Object.assign({}, (condition.price || {})), { gte: data.minPrice });
        }
        const [products, total] = await Promise.all([
            this.productRepository.find({
                where: condition,
                relations: {
                    category: { thumbnailFile: true },
                    productCollections: { collection: true },
                    productImages: true,
                },
            }),
            this.productRepository.count({
                where: condition,
            }),
        ]);
        const suggestions = await this.generateSuggestionsHybridAndNonHybrid(data);
        return {
            result: products,
            total,
            suggestions,
        };
    }
    async generateSuggestionsHybridAndNonHybrid(data) {
        const hybridSuggestions = {};
        if (data.collections && data.collections.length > 0) {
            const availableCollections = await this.collectionRepository.find({
                where: {
                    active: true,
                    name: data.collections,
                },
            });
            hybridSuggestions.relatedCollections = availableCollections.map((c) => c.name);
        }
        if (data.color && data.color.length > 0) {
            const availableColors = await this.productRepository.find({
                where: {
                    active: true,
                    shortDesc: data.color,
                },
                select: ["shortDesc"],
            });
            hybridSuggestions.availableColors = availableColors.map((c) => c.shortDesc);
        }
        const [hotPicksRaw, bestSellersRaw] = await Promise.all([
            this.productRepository
                .createQueryBuilder("product")
                .leftJoin(CartItems_1.CartItems, "cart", '"cart"."ProductId" = "product"."ProductId"')
                .leftJoin(CustomerUserWishlist_1.CustomerUserWishlist, "wishlist", '"wishlist"."ProductId" = "product"."ProductId"')
                .select('"product"."ProductId"', "productId")
                .addSelect('"product"."Name"', "name")
                .addSelect('COUNT("cart"."CartItemId") + COUNT("wishlist"."CustomerUserWishlist")', "popularityScore")
                .where('"product"."Active" = true')
                .groupBy('"product"."ProductId"')
                .addGroupBy('"product"."Name"')
                .orderBy('COUNT("cart"."CartItemId") + COUNT("wishlist"."CustomerUserWishlist")', "DESC")
                .limit(5)
                .getRawMany(),
            this.productRepository
                .createQueryBuilder("product")
                .leftJoin(OrderItems_1.OrderItems, "orderItem", '"orderItem"."ProductId" = "product"."ProductId"')
                .select('"product"."ProductId"', "productId")
                .addSelect('"product"."Name"', "name")
                .addSelect('SUM("orderItem"."Quantity")', "orderCount")
                .where('"product"."Active" = true')
                .groupBy('"product"."ProductId"')
                .addGroupBy('"product"."Name"')
                .orderBy('SUM("orderItem"."Quantity")', "DESC")
                .limit(5)
                .getRawMany(),
        ]);
        return {
            hybridSuggestions,
            nonHybridSuggestions: {
                hotPicks: hotPicksRaw
                    .filter((p) => p.popularityScore !== null && parseInt(p.popularityScore, 10) > 0)
                    .map((p) => ({
                    productId: p.productId,
                    name: p.name,
                    popularityScore: parseInt(p.popularityScore, 10),
                })),
                bestSellers: bestSellersRaw
                    .filter((p) => p.orderCount !== null && parseInt(p.orderCount, 10) > 0)
                    .map((p) => ({
                    productId: p.productId,
                    name: p.name,
                    totalOrders: parseInt(p.orderCount, 10),
                })),
            },
        };
    }
    async listTrends() {
        const { nonHybridSuggestions } = await this.generateSuggestionsHybridAndNonHybrid({});
        return nonHybridSuggestions;
    }
};
AIService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(Product_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(Category_1.Category)),
    __param(4, (0, typeorm_1.InjectRepository)(Collection_1.Collection)),
    __param(5, (0, typeorm_1.InjectRepository)(ProductCollection_1.ProductCollection)),
    __param(6, (0, typeorm_1.InjectRepository)(OrderItems_1.OrderItems)),
    __param(7, (0, typeorm_1.InjectRepository)(CartItems_1.CartItems)),
    __param(8, (0, typeorm_1.InjectRepository)(CustomerUserWishlist_1.CustomerUserWishlist)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AIService);
exports.AIService = AIService;
//# sourceMappingURL=ai.service.js.map