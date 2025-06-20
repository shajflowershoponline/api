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
const product_service_1 = require("./product.service");
const category_service_1 = require("./category.service");
const CustomerUserAiSearch_1 = require("../db/entities/CustomerUserAiSearch");
const Discounts_1 = require("../db/entities/Discounts");
const jsonrepair_1 = require("jsonrepair");
let AIService = class AIService {
    constructor(config, productService, categoryService, httpService, productRepository, categoryRepository, collectionRepository, productCollectionRepository, orderItemsRepository, cartItemsRepository, wishlistRepository, customerUserAiSearchRepository) {
        this.config = config;
        this.productService = productService;
        this.categoryService = categoryService;
        this.httpService = httpService;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.collectionRepository = collectionRepository;
        this.productCollectionRepository = productCollectionRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.wishlistRepository = wishlistRepository;
        this.customerUserAiSearchRepository = customerUserAiSearchRepository;
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
    - ⚠️ Only include "maxPrice" or "minPrice" if user explicitly mentions a price preference.
    - 🚨 If the user DID NOT mention any price preference, DO NOT add "maxPrice" or "minPrice" — leave them out completely.

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
        "occasions": ["Valentines"],
        "collections": ["Valentines"],
        "tags": ["Valentines", "Birthday", "Rose"],
        "maxPrice": 700,
        "minPrice": 0
      },
      "orderBy": "price" | "popularity_score" | "order_count",
      "orderDirection": "asc" | "desc"
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
        "occasions": ["Valentines"],
        "collections": ["Valentines"],
        "categories": ["rose", "sunflower"],
        "tags": ["Valentines", "Rose"],
        "maxPrice": 700,
        "minPrice": 0
      },
      "orderBy": "price" | "popularity_score" | "order_count",
      "orderDirection": "asc" | "desc"
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
        "occasions": ["Valentines"],
        "collections": ["Valentines"],
        "categories": ["rose", "sunflower"],
        "tags": ["rose", "sunflower", "Valentines"],
        "maxPrice": 700,
        "minPrice": 0
      },
      "orderBy": "price" | "popularity_score" | "order_count",
      "orderDirection": "asc" | "desc"
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

    - If the user query is abstract, conceptual, or symbolic — such as asking what flowers are associated with emotions, meanings, values, occasions, or symbolic ideas (e.g., "what flower represents love", "flowers that show loyalty", "flowers for healing", "flower that brings joy") — the AI must return multiple relevant options.
    - The output should still match the correct intent type ('list_categories', 'list_collections', etc.).
    - But the AI must **include multiple values** in fields like 'categories', 'collections', or 'tags', depending on the context of the question.

    🛡️ Safe Defaults:
    - If unsure about orderBy/orderDirection, you can omit it.
    - If unsure about collectionName, you can omit it.

    ---
    User Query: ${userQuery}
  `;
    }
    extractMisplacedKeys(obj, parentKey) {
        const fixed = Object.assign({}, obj);
        if (Array.isArray(fixed[parentKey])) {
            const validItems = [];
            for (const item of fixed[parentKey]) {
                if (typeof item === "string") {
                    validItems.push(item);
                }
                else if (typeof item === "object" && !Array.isArray(item)) {
                    Object.assign(fixed, item);
                }
            }
            fixed[parentKey] = validItems;
        }
        return fixed;
    }
    safeParseJson(aiMessage) {
        const firstCurly = aiMessage.indexOf("{");
        const lastCurly = aiMessage.lastIndexOf("}");
        if (firstCurly === -1 || lastCurly === -1) {
            throw new Error("No JSON block detected in AI output.");
        }
        const jsonBlock = aiMessage
            .slice(firstCurly, lastCurly + 1)
            .replace(/,\s*}/g, "}")
            .replace(/,\s*\]/g, "]")
            .replace(/\[\s*,/g, "[")
            .replace(/\]\s*\]/g, "]")
            .replace(/\]\s*}/g, "]}");
        let parsed;
        try {
            parsed = JSON.parse(jsonBlock);
        }
        catch (_a) {
            try {
                parsed = JSON.parse((0, jsonrepair_1.jsonrepair)(jsonBlock));
            }
            catch (err) {
                throw new Error("Failed to repair malformed JSON.");
            }
        }
        if (parsed === null || parsed === void 0 ? void 0 : parsed.data) {
            for (const key of ["collections", "categories", "color", "tags"]) {
                if (parsed.data[key]) {
                    parsed.data = this.extractMisplacedKeys(parsed.data, key);
                }
            }
        }
        return parsed;
    }
    cleanData(data) {
        if (!(data === null || data === void 0 ? void 0 : data.maxPrice) || (data === null || data === void 0 ? void 0 : data.maxPrice) === undefined) {
            data.maxPrice = 10000;
            data.minPrice = 0;
        }
        else if ((data === null || data === void 0 ? void 0 : data.maxPrice) &&
            Number(data === null || data === void 0 ? void 0 : data.maxPrice) > 0 &&
            (!(data === null || data === void 0 ? void 0 : data.minPrice) || (data === null || data === void 0 ? void 0 : data.minPrice) === undefined)) {
            data.minPrice = 0;
        }
        return data;
    }
    async handleSearch({ query, customerUserId }) {
        const prompt = await this.buildPrompt(query);
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.config.get("GROQ_API_URL"), {
            model: "llama3-70b-8192",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: query },
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
            aiResult = this.safeParseJson(aiMessage);
        }
        catch (err) {
            console.error("Parse Error:", err.message);
            console.error("Raw AI Output:", aiMessage);
            throw new Error("Failed to parse AI output safely.");
        }
        const { intent, data, orderBy, orderDirection } = aiResult;
        let results = null;
        if (intent === "search_product") {
            results = await this.searchProducts(this.cleanData(data), customerUserId);
        }
        else if (intent === "list_categories") {
            results = await this.listCategories(Object.assign(Object.assign({}, this.cleanData(data)), { orderBy, orderDirection }), customerUserId);
        }
        else if (intent === "list_collections") {
            results = await this.listCollections(Object.assign(Object.assign({}, this.cleanData(data)), { orderBy,
                orderDirection }), customerUserId);
        }
        else if (intent === "list_colors") {
            results = await this.listColors(Object.assign(Object.assign({}, this.cleanData(data)), { orderBy, orderDirection }), customerUserId);
        }
        else if (intent === "list_trend") {
            results = await this.listTrends(customerUserId);
        }
        else {
            throw Error("Sorry, I can only assist you with flowers, bouquets, categories, collections, or colors. Please rephrase your question!");
        }
        return {
            results,
            params: aiResult,
        };
    }
    async listCategories(data, customerUserId) {
        var _a, _b, _c, _d, _e, _f, _g;
        const qb = this.categoryRepository
            .createQueryBuilder("category")
            .leftJoin("category.products", "product")
            .leftJoin("product.productCollections", "productCollection")
            .leftJoin("productCollection.collection", "collection")
            .where('category."Active" = true');
        const orWhereExpressions = [];
        const orWhereParams = {};
        if (((_a = data === null || data === void 0 ? void 0 : data.categories) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            data.categories.forEach((c, idx) => {
                orWhereExpressions.push(`LOWER(category."Name") LIKE :category${idx}`);
                orWhereParams[`category${idx}`] = `%${c.toLowerCase()}%`;
            });
        }
        if (((_b = data === null || data === void 0 ? void 0 : data.collections) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            data.collections.forEach((c, idx) => {
                orWhereExpressions.push(`LOWER(collection."Name") LIKE :collection${idx}`);
                orWhereParams[`collection${idx}`] = `%${c.toLowerCase()}%`;
            });
        }
        if (((_c = data === null || data === void 0 ? void 0 : data.occasions) === null || _c === void 0 ? void 0 : _c.length) > 0 || ((_d = data === null || data === void 0 ? void 0 : data.tags) === null || _d === void 0 ? void 0 : _d.length) > 0) {
            const tags = [...(data.occasions || []), ...(data.tags || [])];
            tags.forEach((tag, idx) => {
                orWhereExpressions.push(`LOWER(collection."Name") LIKE :tag${idx}`);
                orWhereParams[`tag${idx}`] = `%${tag.toLowerCase()}%`;
            });
        }
        if (orWhereExpressions.length > 0) {
            qb.andWhere(orWhereExpressions.join(" OR "), orWhereParams);
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
                .orderBy("price", ((_e = data.orderDirection) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || "ASC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "popularity_score") {
            qb.addSelect(`(SELECT COUNT(*) FROM dbo."CartItems" cart WHERE cart."ProductId" = product."ProductId") + (SELECT COUNT(*) FROM dbo."CustomerUserWishlist" wish WHERE wish."ProductId" = product."ProductId")`, "popularityScore")
                .groupBy('category."CategoryId"')
                .addGroupBy('category."Name"')
                .orderBy("popularityScore", ((_f = data.orderDirection) === null || _f === void 0 ? void 0 : _f.toUpperCase()) || "DESC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "order_count") {
            qb.addSelect(`(SELECT SUM(orderItem."Quantity") FROM dbo."OrderItems" orderItem WHERE orderItem."ProductId" = product."ProductId")`, "orderCount")
                .groupBy('category."CategoryId"')
                .addGroupBy('category."Name"')
                .orderBy("orderCount", ((_g = data.orderDirection) === null || _g === void 0 ? void 0 : _g.toUpperCase()) || "DESC");
        }
        else {
            qb.groupBy('category."CategoryId"')
                .addGroupBy('category."Name"')
                .orderBy('category."SequenceId"', "ASC");
        }
        const categories = await qb.getRawMany();
        const categoryIds = categories.map((c) => { var _a; return Number((_a = c.category_CategoryId) !== null && _a !== void 0 ? _a : 0); });
        const categoryNames = categories.map((c) => c.category_Name);
        const tags = [
            ...(data.categories || []),
            ...(data.collections || []),
            ...(data.occasions || []),
            ...(data.tags || []),
        ];
        const conditionForProductFocus = {
            active: true,
        };
        if (tags.length > 0) {
            const productIds = await this.productService.advancedSearchProductIds(tags.join(" "));
            if (productIds.length > 0) {
                conditionForProductFocus.productId = (0, typeorm_2.In)(productIds.map((x) => Number(x)));
            }
        }
        const [products, total, customerUserWishlist, discounts] = await Promise.all([
            this.productRepository.find({
                where: [
                    conditionForProductFocus,
                    {
                        category: {
                            categoryId: (0, typeorm_2.In)(categoryIds),
                        },
                    },
                ],
                relations: {
                    category: { thumbnailFile: true },
                    productCollections: { collection: true },
                    productImages: {
                        file: true,
                    },
                },
            }),
            this.productRepository.count({
                where: [
                    conditionForProductFocus,
                    {
                        category: {
                            categoryId: (0, typeorm_2.In)(categoryIds),
                        },
                    },
                ],
            }),
            this.productRepository.manager.find(CustomerUserWishlist_1.CustomerUserWishlist, {
                where: {
                    customerUser: {
                        customerUserId,
                    },
                },
                relations: {
                    customerUser: true,
                    product: true,
                },
            }),
            this.productRepository.manager.find(Discounts_1.Discounts, {
                where: {
                    active: true,
                },
            }),
        ]);
        return {
            categories: categoryNames,
            products: products.map((p) => {
                var _a, _b, _c, _d;
                const maxDiscount = ((_a = p.discountTagsIds) !== null && _a !== void 0 ? _a : "") !== ""
                    ? Math.max(...discounts
                        .filter((d) => p.discountTagsIds.split(",").includes(d.discountId))
                        .map((d) => {
                        var _a;
                        return d.type === "PERCENTAGE"
                            ? (parseFloat(d.value) / 100) * Number((_a = p.price) !== null && _a !== void 0 ? _a : 0)
                            : parseFloat(d.value);
                    }))
                    : 0;
                p["discountPrice"] = (Number((_b = p.price) !== null && _b !== void 0 ? _b : 0) - maxDiscount).toString();
                p["isSale"] =
                    ((_c = p.discountTagsIds) === null || _c === void 0 ? void 0 : _c.length) + p.productCollections.length > 0 &&
                        (p.productCollections.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId && x.collection.isSale; }) ||
                            ((_d = p.discountTagsIds) !== null && _d !== void 0 ? _d : "").split(", ").length > 0);
                p["iAmInterested"] = customerUserWishlist.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                p["customerUserWishlist"] = customerUserWishlist.find((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                return p;
            }),
            total,
        };
    }
    async listCollections(data, customerUserId) {
        var _a, _b, _c, _d, _e, _f, _g;
        const qb = this.collectionRepository
            .createQueryBuilder("collection")
            .leftJoin("collection.productCollections", "productCollection")
            .leftJoin("productCollection.product", "product")
            .where('collection."Active" = true');
        const orWhereExpressions = [];
        const orWhereParams = {};
        if (((_a = data === null || data === void 0 ? void 0 : data.categories) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            data.categories.forEach((c, idx) => {
                orWhereExpressions.push(`LOWER(category."Name") LIKE :category${idx}`);
                orWhereParams[`category${idx}`] = `%${c.toLowerCase()}%`;
            });
        }
        if (((_b = data === null || data === void 0 ? void 0 : data.collections) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            data.collections.forEach((c, idx) => {
                orWhereExpressions.push(`LOWER(collection."Name") LIKE :collection${idx}`);
                orWhereParams[`collection${idx}`] = `%${c.toLowerCase()}%`;
            });
        }
        if (((_c = data === null || data === void 0 ? void 0 : data.occasions) === null || _c === void 0 ? void 0 : _c.length) > 0 || ((_d = data === null || data === void 0 ? void 0 : data.tags) === null || _d === void 0 ? void 0 : _d.length) > 0) {
            const tags = [...(data.occasions || []), ...(data.tags || [])];
            tags.forEach((tag, idx) => {
                orWhereExpressions.push(`LOWER(collection."Name") LIKE :tag${idx}`);
                orWhereParams[`tag${idx}`] = `%${tag.toLowerCase()}%`;
            });
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
                .orderBy("price", ((_e = data.orderDirection) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || "ASC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "popularity_score") {
            qb.addSelect(`(SELECT COUNT(*) FROM dbo."CartItems" cart WHERE cart."ProductId" = product."ProductId") + (SELECT COUNT(*) FROM dbo."CustomerUserWishlist" wish WHERE wish."ProductId" = product."ProductId")`, "popularityScore")
                .groupBy('collection."CollectionId"')
                .addGroupBy('collection."Name"')
                .orderBy("popularityScore", ((_f = data.orderDirection) === null || _f === void 0 ? void 0 : _f.toUpperCase()) || "DESC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "order_count") {
            qb.addSelect(`(SELECT SUM(orderItem."Quantity") FROM dbo."OrderItems" orderItem WHERE orderItem."ProductId" = product."ProductId")`, "orderCount")
                .groupBy('collection."CollectionId"')
                .addGroupBy('collection."Name"')
                .orderBy("orderCount", ((_g = data.orderDirection) === null || _g === void 0 ? void 0 : _g.toUpperCase()) || "DESC");
        }
        else {
            qb.groupBy('collection."CollectionId"')
                .addGroupBy('collection."Name"')
                .orderBy('collection."SequenceId"', "ASC");
        }
        const collections = await qb.getRawMany();
        const collectionIds = collections.map((c) => { var _a; return Number((_a = c.collection_CollectionId) !== null && _a !== void 0 ? _a : 0); });
        const collectionNames = collections.map((c) => c.collection_Name);
        const tags = [
            ...(data.categories || []),
            ...(data.collections || []),
            ...(data.occasions || []),
            ...(data.tags || []),
        ];
        const conditionForProductFocus = {
            active: true,
        };
        if (tags.length > 0) {
            const productIds = await this.productService.advancedSearchProductIds(tags.join(" "));
            if (productIds.length > 0) {
                conditionForProductFocus.productId = (0, typeorm_2.In)(productIds.map((x) => Number(x)));
            }
        }
        const [products, total, customerUserWishlist, discounts] = await Promise.all([
            this.productRepository.find({
                where: [
                    conditionForProductFocus,
                    {
                        category: {
                            categoryId: (0, typeorm_2.In)(collectionIds),
                        },
                    },
                ],
                relations: {
                    category: { thumbnailFile: true },
                    productCollections: { collection: true },
                    productImages: {
                        file: true,
                    },
                },
            }),
            this.productRepository.count({
                where: [
                    conditionForProductFocus,
                    {
                        category: {
                            categoryId: (0, typeorm_2.In)(collectionIds),
                        },
                    },
                ],
            }),
            this.productRepository.manager.find(CustomerUserWishlist_1.CustomerUserWishlist, {
                where: {
                    customerUser: {
                        customerUserId,
                    },
                },
                relations: {
                    customerUser: true,
                    product: true,
                },
            }),
            this.productRepository.manager.find(Discounts_1.Discounts, {
                where: {
                    active: true,
                },
            }),
        ]);
        return {
            collections: collectionNames,
            products: products.map((p) => {
                var _a, _b, _c, _d;
                const maxDiscount = ((_a = p.discountTagsIds) !== null && _a !== void 0 ? _a : "") !== ""
                    ? Math.max(...discounts
                        .filter((d) => p.discountTagsIds.split(",").includes(d.discountId))
                        .map((d) => {
                        var _a;
                        return d.type === "PERCENTAGE"
                            ? (parseFloat(d.value) / 100) * Number((_a = p.price) !== null && _a !== void 0 ? _a : 0)
                            : parseFloat(d.value);
                    }))
                    : 0;
                p["discountPrice"] = (Number((_b = p.price) !== null && _b !== void 0 ? _b : 0) - maxDiscount).toString();
                p["isSale"] =
                    ((_c = p.discountTagsIds) === null || _c === void 0 ? void 0 : _c.length) + p.productCollections.length > 0 &&
                        (p.productCollections.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId && x.collection.isSale; }) ||
                            ((_d = p.discountTagsIds) !== null && _d !== void 0 ? _d : "").split(", ").length > 0);
                p["iAmInterested"] = customerUserWishlist.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                p["customerUserWishlist"] = customerUserWishlist.find((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                return p;
            }),
            total,
        };
    }
    async listColors(data, customerUserId) {
        var _a, _b, _c, _d, _e, _f, _g;
        const qb = this.productRepository
            .createQueryBuilder("product")
            .leftJoin("product.productCollections", "productCollection")
            .leftJoin("productCollection.collection", "collection")
            .leftJoin("product.category", "category")
            .where('product."Active" = true')
            .andWhere('product."Color" IS NOT NULL');
        const orWhereExpressions = [];
        const orWhereParams = {};
        if (((_a = data === null || data === void 0 ? void 0 : data.categories) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            data.categories.forEach((c, idx) => {
                orWhereExpressions.push(`LOWER(category."Name") LIKE :category${idx}`);
                orWhereParams[`category${idx}`] = `%${c.toLowerCase()}%`;
            });
        }
        if (((_b = data === null || data === void 0 ? void 0 : data.collections) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            data.collections.forEach((c, idx) => {
                orWhereExpressions.push(`LOWER(collection."Name") LIKE :collection${idx}`);
                orWhereParams[`collection${idx}`] = `%${c.toLowerCase()}%`;
            });
        }
        if (((_c = data === null || data === void 0 ? void 0 : data.occasions) === null || _c === void 0 ? void 0 : _c.length) > 0 || ((_d = data === null || data === void 0 ? void 0 : data.tags) === null || _d === void 0 ? void 0 : _d.length) > 0) {
            const tags = [...(data.occasions || []), ...(data.tags || [])];
            tags.forEach((tag, idx) => {
                orWhereExpressions.push(`LOWER(collection."Name") LIKE :tag${idx}`);
                orWhereParams[`tag${idx}`] = `%${tag.toLowerCase()}%`;
            });
        }
        if (orWhereExpressions.length > 0) {
            qb.andWhere(orWhereExpressions.join(" OR "), orWhereParams);
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
                .addGroupBy('product."ProductId"')
                .orderBy("price", ((_e = data.orderDirection) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || "ASC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "popularity_score") {
            qb.addSelect(`(SELECT COUNT(*) FROM dbo."CartItems" cart WHERE cart."ProductId" = product."ProductId") + product."Interested"`, "popularityScore")
                .groupBy('product."Color"')
                .addGroupBy('product."ProductId"')
                .orderBy(`product."Interested"`, ((_f = data.orderDirection) === null || _f === void 0 ? void 0 : _f.toUpperCase()) || "DESC");
        }
        else if ((data === null || data === void 0 ? void 0 : data.orderBy) === "order_count") {
            qb.addSelect(`(SELECT SUM(orderItem."Quantity") FROM dbo."OrderItems" orderItem WHERE orderItem."ProductId" = product."ProductId")`, "orderCount")
                .groupBy('product."Color"')
                .addGroupBy('product."ProductId"')
                .orderBy("orderCount", ((_g = data.orderDirection) === null || _g === void 0 ? void 0 : _g.toUpperCase()) || "DESC");
        }
        const colors = await qb.getRawMany();
        const colorNames = colors.map((c) => c.product_Color);
        const tags = [
            ...(data.categories || []),
            ...(data.collections || []),
            ...(data.occasions || []),
            ...(data.tags || []),
        ];
        const conditionForProductFocus = {
            active: true,
        };
        if (tags.length > 0) {
            const productIds = await this.productService.advancedSearchProductIds(tags.join(" "));
            if (productIds.length > 0) {
                conditionForProductFocus.productId = (0, typeorm_2.In)(productIds.map((x) => Number(x)));
            }
        }
        const [products, total, customerUserWishlist, discounts] = await Promise.all([
            this.productRepository.find({
                where: [
                    conditionForProductFocus,
                    {
                        color: (0, typeorm_2.In)(colorNames),
                    },
                ],
                relations: {
                    category: { thumbnailFile: true },
                    productCollections: { collection: true },
                    productImages: {
                        file: true,
                    },
                },
            }),
            this.productRepository.count({
                where: [
                    conditionForProductFocus,
                    {
                        color: (0, typeorm_2.In)(colorNames),
                    },
                ],
            }),
            this.productRepository.manager.find(CustomerUserWishlist_1.CustomerUserWishlist, {
                where: {
                    customerUser: {
                        customerUserId,
                    },
                },
                relations: {
                    customerUser: true,
                    product: true,
                },
            }),
            this.productRepository.manager.find(Discounts_1.Discounts, {
                where: {
                    active: true,
                },
            }),
        ]);
        return {
            colors: colorNames,
            products: products.map((p) => {
                var _a, _b, _c, _d;
                const maxDiscount = ((_a = p.discountTagsIds) !== null && _a !== void 0 ? _a : "") !== ""
                    ? Math.max(...discounts
                        .filter((d) => p.discountTagsIds.split(",").includes(d.discountId))
                        .map((d) => {
                        var _a;
                        return d.type === "PERCENTAGE"
                            ? (parseFloat(d.value) / 100) * Number((_a = p.price) !== null && _a !== void 0 ? _a : 0)
                            : parseFloat(d.value);
                    }))
                    : 0;
                p["discountPrice"] = (Number((_b = p.price) !== null && _b !== void 0 ? _b : 0) - maxDiscount).toString();
                p["isSale"] =
                    ((_c = p.discountTagsIds) === null || _c === void 0 ? void 0 : _c.length) + p.productCollections.length > 0 &&
                        (p.productCollections.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId && x.collection.isSale; }) ||
                            ((_d = p.discountTagsIds) !== null && _d !== void 0 ? _d : "").split(", ").length > 0);
                p["iAmInterested"] = customerUserWishlist.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                p["customerUserWishlist"] = customerUserWishlist.find((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                return p;
            }),
            total,
        };
    }
    async searchProducts(data, customerUserId) {
        var _a, _b;
        const conditionForProductFocus = { active: true };
        const conditionCategoryFocus = { active: true };
        const productIds = await this.productService.advancedSearchProductIds((_a = data.productName) !== null && _a !== void 0 ? _a : "");
        const categoryIds = await this.categoryService.advancedSearchCategoryIds((_b = data.category) !== null && _b !== void 0 ? _b : "");
        if (productIds.length > 0) {
            conditionForProductFocus.productId = (0, typeorm_2.In)(productIds.map((x) => Number(x)));
        }
        if (categoryIds.length > 0) {
            conditionCategoryFocus.category = {
                categoryId: (0, typeorm_2.In)(categoryIds.map((x) => Number(x))),
                active: true,
            };
        }
        if (data.category) {
            conditionForProductFocus.category = {
                name: (0, typeorm_2.ILike)(`%${data.category}%`),
                active: true,
            };
            conditionCategoryFocus.category = { name: (0, typeorm_2.ILike)(`%${data.category}%`) };
        }
        if (data.price && !isNaN(Number(data.price)) && Number(data.price) > 0) {
            if (data.maxPrice &&
                !isNaN(Number(data.maxPrice)) &&
                Number(data.maxPrice) > 0) {
                data.maxPrice = Math.max(Number(data.price), Number(data.maxPrice));
            }
            else {
                data.maxPrice = Number(data.price);
            }
            if (data.minPrice && !isNaN(Number(data.minPrice))) {
                data.minPrice = Math.max(Number(data.price), Number(data.minPrice));
            }
        }
        else {
            if (data.maxPrice &&
                !isNaN(Number(data.maxPrice)) &&
                Number(data.maxPrice) > 0) {
                data.maxPrice = Number(data.maxPrice);
            }
            if (data.minPrice &&
                !isNaN(Number(data.minPrice)) &&
                Number(data.minPrice) > 0) {
                data.minPrice = Number(data.minPrice);
            }
        }
        if (data.minPrice === data.maxPrice) {
            conditionForProductFocus.price = (0, typeorm_2.Between)(0, Number(data.maxPrice));
            conditionCategoryFocus.price = (0, typeorm_2.Between)(0, Number(data.maxPrice));
        }
        else {
            conditionForProductFocus.price = (0, typeorm_2.Between)(Number(data.minPrice), Number(data.maxPrice));
            conditionCategoryFocus.price = (0, typeorm_2.Between)(Number(data.minPrice), Number(data.maxPrice));
        }
        const [products, total, customerUserWishlist, discounts] = await Promise.all([
            this.productRepository.find({
                where: [conditionForProductFocus, conditionCategoryFocus],
                relations: {
                    category: { thumbnailFile: true },
                    productCollections: { collection: true },
                    productImages: {
                        file: true,
                    },
                },
            }),
            this.productRepository.count({
                where: [conditionForProductFocus, conditionCategoryFocus],
            }),
            this.productRepository.manager.find(CustomerUserWishlist_1.CustomerUserWishlist, {
                where: {
                    customerUser: {
                        customerUserId,
                    },
                },
                relations: {
                    customerUser: true,
                    product: true,
                },
            }),
            this.productRepository.manager.find(Discounts_1.Discounts, {
                where: {
                    active: true,
                },
            }),
        ]);
        const suggestions = await this.generateSuggestionsHybridAndNonHybrid(data, customerUserId);
        return {
            products: products.map((p) => {
                var _a, _b, _c, _d, _e;
                const maxDiscount = ((_a = p.discountTagsIds) !== null && _a !== void 0 ? _a : "") !== ""
                    ? Math.max(...discounts
                        .filter((d) => p.discountTagsIds.split(",").includes(d.discountId))
                        .map((d) => {
                        var _a;
                        return d.type === "PERCENTAGE"
                            ? (parseFloat(d.value) / 100) * Number((_a = p.price) !== null && _a !== void 0 ? _a : 0)
                            : parseFloat(d.value);
                    }))
                    : 0;
                p["discountPrice"] = Number((_b = p.price) !== null && _b !== void 0 ? _b : 0) - maxDiscount;
                p["price"] = Number((_c = p.price) !== null && _c !== void 0 ? _c : 0);
                p["isSale"] =
                    ((_d = p.discountTagsIds) === null || _d === void 0 ? void 0 : _d.length) + p.productCollections.length > 0 &&
                        (p.productCollections.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId && x.collection.isSale; }) ||
                            ((_e = p.discountTagsIds) !== null && _e !== void 0 ? _e : "").split(", ").length > 0);
                p["iAmInterested"] = customerUserWishlist.some((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                p["customerUserWishlist"] = customerUserWishlist.find((x) => { var _a; return ((_a = x.product) === null || _a === void 0 ? void 0 : _a.productId) === p.productId; });
                return p;
            }),
            total,
            suggestions,
        };
    }
    async generateSuggestionsHybridAndNonHybrid(data, customerUserId) {
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
            const availableColors = await this.productRepository
                .createQueryBuilder("product")
                .select(["product.color"])
                .where("product.active = :active", { active: true })
                .andWhere(data.color && data.color.length > 0
                ? `(${data.color
                    .map((_, idx) => `(LOWER(product."Color") LIKE :color${idx} OR LOWER(product."Name") LIKE :color${idx} OR LOWER(product."ShortDesc") LIKE :color${idx} OR LOWER(product."LongDesc") LIKE :color${idx})`)
                    .join(" OR ")})`
                : "1=1", data.color && data.color.length > 0
                ? Object.fromEntries(data.color.map((c, idx) => [
                    `color${idx}`,
                    `%${c.toLowerCase()}%`,
                ]))
                : {})
                .getRawMany();
            const colorSet = new Set((data.color || []).map((c) => c.trim().toLowerCase()));
            hybridSuggestions.availableColors = Array.from(new Set(availableColors
                .map((c) => c.product_Color)
                .filter((color) => color && colorSet.has(color.trim().toLowerCase()))));
        }
        const [hotPicksRaw, bestSellersRaw] = await Promise.all([
            this.productRepository
                .createQueryBuilder("product")
                .leftJoin(CartItems_1.CartItems, "cart", '"cart"."ProductId" = "product"."ProductId"')
                .leftJoin(CustomerUserWishlist_1.CustomerUserWishlist, "wishlist", '"wishlist"."ProductId" = "product"."ProductId"')
                .select('"product"."ProductId"', "productId")
                .addSelect('COUNT("cart"."CartItemId") + COUNT("wishlist"."CustomerUserWishlistId")', "popularityScore")
                .where('"product"."Active" = true')
                .groupBy('"product"."ProductId"')
                .addGroupBy('"product"."Name"')
                .orderBy('COUNT("cart"."CartItemId") + COUNT("wishlist"."CustomerUserWishlistId")', "DESC")
                .limit(5)
                .getRawMany(),
            this.productRepository
                .createQueryBuilder("product")
                .leftJoin(OrderItems_1.OrderItems, "orderItem", '"orderItem"."ProductId" = "product"."ProductId"')
                .select('"product"."ProductId"', "productId")
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
                    popularityScore: parseInt(p.popularityScore, 10),
                })),
                bestSellers: bestSellersRaw
                    .filter((p) => p.orderCount !== null && parseInt(p.orderCount, 10) > 0)
                    .map((p) => ({
                    productId: p.productId,
                    totalOrders: parseInt(p.orderCount, 10),
                })),
            },
        };
    }
    async listTrends(customerUserId) {
        const { nonHybridSuggestions } = await this.generateSuggestionsHybridAndNonHybrid({}, customerUserId);
        return nonHybridSuggestions;
    }
};
AIService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(Product_1.Product)),
    __param(5, (0, typeorm_1.InjectRepository)(Category_1.Category)),
    __param(6, (0, typeorm_1.InjectRepository)(Collection_1.Collection)),
    __param(7, (0, typeorm_1.InjectRepository)(ProductCollection_1.ProductCollection)),
    __param(8, (0, typeorm_1.InjectRepository)(OrderItems_1.OrderItems)),
    __param(9, (0, typeorm_1.InjectRepository)(CartItems_1.CartItems)),
    __param(10, (0, typeorm_1.InjectRepository)(CustomerUserWishlist_1.CustomerUserWishlist)),
    __param(11, (0, typeorm_1.InjectRepository)(CustomerUserAiSearch_1.CustomerUserAiSearch)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        product_service_1.ProductService,
        category_service_1.CategoryService,
        axios_1.HttpService,
        typeorm_2.Repository,
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