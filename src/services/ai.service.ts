import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike, Between, In } from "typeorm";
import { Product } from "../db/entities/Product";
import { Category } from "../db/entities/Category";
import { Collection } from "../db/entities/Collection";
import { ProductCollection } from "../db/entities/ProductCollection";
import { OrderItems } from "../db/entities/OrderItems";
import { CartItems } from "../db/entities/CartItems";
import { CustomerUserWishlist } from "../db/entities/CustomerUserWishlist";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ProductService } from "./product.service";
import { CategoryService } from "./category.service";
import { CustomerUserAiSearch } from "src/db/entities/CustomerUserAiSearch";
import { Discounts } from "src/db/entities/Discounts";
import { jsonrepair } from "jsonrepair";

@Injectable()
export class AIService {
  constructor(
    private readonly config: ConfigService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly httpService: HttpService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(ProductCollection)
    private readonly productCollectionRepository: Repository<ProductCollection>,
    @InjectRepository(OrderItems)
    private readonly orderItemsRepository: Repository<OrderItems>,
    @InjectRepository(CartItems)
    private readonly cartItemsRepository: Repository<CartItems>,
    @InjectRepository(CustomerUserWishlist)
    private readonly wishlistRepository: Repository<CustomerUserWishlist>,
    @InjectRepository(CustomerUserAiSearch)
    private readonly customerUserAiSearchRepository: Repository<CustomerUserAiSearch>
  ) { }

  private async buildPrompt(userQuery: string): Promise<string> {
    const categoryNames = this.config.get<string>("FLOWER_TYPES");

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

  extractMisplacedKeys(obj: any, parentKey: string): any {
    const fixed = { ...obj };

    if (Array.isArray(fixed[parentKey])) {
      const validItems = [];
      for (const item of fixed[parentKey]) {
        if (typeof item === "string") {
          validItems.push(item);
        } else if (typeof item === "object" && !Array.isArray(item)) {
          Object.assign(fixed, item); // lift up misplaced keys
        }
      }
      fixed[parentKey] = validItems;
    }

    return fixed;
  }

  safeParseJson(aiMessage: string): any {
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

    let parsed: any;
    try {
      parsed = JSON.parse(jsonBlock);
    } catch {
      try {
        parsed = JSON.parse(jsonrepair(jsonBlock));
      } catch (err) {
        throw new Error("Failed to repair malformed JSON.");
      }
    }

    if (parsed?.data) {
      for (const key of ["collections", "categories", "color", "tags"]) {
        if (parsed.data[key]) {
          parsed.data = this.extractMisplacedKeys(parsed.data, key);
        }
      }
    }

    return parsed;
  }

  cleanData(data: any): any {
    if (!data?.maxPrice || data?.maxPrice === undefined) {
      data.maxPrice = 10000;
      data.minPrice = 0;
    } else if (
      data?.maxPrice &&
      Number(data?.maxPrice) > 0 &&
      (!data?.minPrice || data?.minPrice === undefined)
    ) {
      data.minPrice = 0;
    }
    return data;
  }

  async handleSearch({ query, customerUserId }) {
    const prompt = await this.buildPrompt(query);

    const response = await firstValueFrom(
      this.httpService.post(
        this.config.get<string>("GROQ_API_URL"),
        {
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: query },
          ],
          temperature: 0.0,
          max_tokens: 800,
        },
        {
          headers: {
            "Accept-Encoding": "gzip, deflate",
            Authorization: `Bearer ${this.config.get<string>("GROQ_API_KEY")}`,
            "Content-Type": "application/json",
          },
        }
      )
    );
    const aiMessage = response.data.choices[0].message.content;

    console.log(aiMessage);

    let aiResult: any;

    try {
      aiResult = this.safeParseJson(aiMessage);
    } catch (err) {
      console.error("Parse Error:", err.message);
      console.error("Raw AI Output:", aiMessage);
      throw new Error("Failed to parse AI output safely.");
    }

    const { intent, data, orderBy, orderDirection } = aiResult;

    let results = null;
    if (intent === "search_product") {
      results = await this.searchProducts(this.cleanData(data), customerUserId);
    } else if (intent === "list_categories") {
      results = await this.listCategories(
        { ...this.cleanData(data), orderBy, orderDirection },
        customerUserId
      );
    } else if (intent === "list_collections") {
      results = await this.listCollections(
        {
          ...this.cleanData(data),
          orderBy,
          orderDirection,
        },
        customerUserId
      );
    } else if (intent === "list_colors") {
      results = await this.listColors(
        { ...this.cleanData(data), orderBy, orderDirection },
        customerUserId
      );
    } else if (intent === "list_trend") {
      results = await this.listTrends(customerUserId);
    } else {
      throw Error(
        "Sorry, I can only assist you with flowers, bouquets, categories, collections, or colors. Please rephrase your question!"
      );
    }

    // const customerUserAiSearch = new CustomerUserAiSearch();

    // customerUserAiSearch.bestSellers = results.

    // await this.customerUserAiSearchRepository.save(customerUserAiSearch);

    return {
      results,
      params: aiResult,
    };
  }

  private async listCategories(data: any, customerUserId) {
    const qb = this.categoryRepository
      .createQueryBuilder("category")
      .leftJoin("category.products", "product")
      .leftJoin("product.productCollections", "productCollection")
      .leftJoin("productCollection.collection", "collection")
      .where('category."Active" = true');

    // Optional Filters
    // Combine categories, collections, occasions, and tags into a single OR filter
    const orWhereExpressions: string[] = [];
    const orWhereParams: Record<string, any> = {};

    if (data?.categories?.length > 0) {
      data.categories.forEach((c: string, idx: number) => {
        orWhereExpressions.push(`LOWER(category."Name") LIKE :category${idx}`);
        orWhereParams[`category${idx}`] = `%${c.toLowerCase()}%`;
      });
    }
    if (data?.collections?.length > 0) {
      data.collections.forEach((c: string, idx: number) => {
        orWhereExpressions.push(
          `LOWER(collection."Name") LIKE :collection${idx}`
        );
        orWhereParams[`collection${idx}`] = `%${c.toLowerCase()}%`;
      });
    }
    if (data?.occasions?.length > 0 || data?.tags?.length > 0) {
      const tags = [...(data.occasions || []), ...(data.tags || [])];
      tags.forEach((tag: string, idx: number) => {
        orWhereExpressions.push(`LOWER(collection."Name") LIKE :tag${idx}`);
        orWhereParams[`tag${idx}`] = `%${tag.toLowerCase()}%`;
      });
    }

    if (orWhereExpressions.length > 0) {
      qb.andWhere(orWhereExpressions.join(" OR "), orWhereParams);
    }
    if (data?.minPrice) {
      qb.andWhere('product."Price" >= :minPrice', { minPrice: data.minPrice });
    }
    if (data?.maxPrice) {
      qb.andWhere('product."Price" <= :maxPrice', { maxPrice: data.maxPrice });
    }

    // Order By
    if (data?.orderBy === "price") {
      qb.addSelect('MIN(product."Price")', "price")
        .groupBy('category."CategoryId"')
        .addGroupBy('category."Name"')
        .orderBy("price", data.orderDirection?.toUpperCase() || "ASC");
    } else if (data?.orderBy === "popularity_score") {
      qb.addSelect(
        `(SELECT COUNT(*) FROM dbo."CartItems" cart WHERE cart."ProductId" = product."ProductId") + (SELECT COUNT(*) FROM dbo."CustomerUserWishlist" wish WHERE wish."ProductId" = product."ProductId")`,
        "popularityScore"
      )
        .groupBy('category."CategoryId"')
        .addGroupBy('category."Name"')
        .orderBy(
          "popularityScore",
          data.orderDirection?.toUpperCase() || "DESC"
        );
    } else if (data?.orderBy === "order_count") {
      qb.addSelect(
        `(SELECT SUM(orderItem."Quantity") FROM dbo."OrderItems" orderItem WHERE orderItem."ProductId" = product."ProductId")`,
        "orderCount"
      )
        .groupBy('category."CategoryId"')
        .addGroupBy('category."Name"')
        .orderBy("orderCount", data.orderDirection?.toUpperCase() || "DESC");
    } else {
      qb.groupBy('category."CategoryId"')
        .addGroupBy('category."Name"')
        .orderBy('category."SequenceId"', "ASC");
    }

    const categories = await qb.getRawMany();
    const categoryIds = categories.map((c) =>
      Number(c.category_CategoryId ?? 0)
    );
    const categoryNames = categories.map((c) => c.category_Name);

    const tags = [
      ...(data.categories || []),
      ...(data.collections || []),
      ...(data.occasions || []),
      ...(data.tags || []),
    ];
    const conditionForProductFocus = {
      active: true,
    } as any;
    if (tags.length > 0) {
      const productIds = await this.productService.advancedSearchProductIds(
        tags.join(" ")
      );

      if (productIds.length > 0) {
        conditionForProductFocus.productId = In(
          productIds.map((x) => Number(x))
        );
      }
    }

    const [products, total, customerUserWishlist, discounts] =
      await Promise.all([
        this.productRepository.find({
          where: [
            conditionForProductFocus,
            {
              category: {
                categoryId: In(categoryIds),
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
                categoryId: In(categoryIds),
              },
            },
          ],
        }),
        this.productRepository.manager.find(CustomerUserWishlist, {
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
        this.productRepository.manager.find(Discounts, {
          where: {
            active: true,
          },
        }),
      ]);

    return {
      categories: categoryNames,
      products: products.map((p) => {
        const maxDiscount =
          (p.discountTagsIds ?? "") !== ""
            ? Math.max(
              ...discounts
                .filter((d) =>
                  p.discountTagsIds.split(",").includes(d.discountId)
                )
                .map((d) =>
                  d.type === "PERCENTAGE"
                    ? (parseFloat(d.value) / 100) * Number(p.price ?? 0)
                    : parseFloat(d.value)
                )
            )
            : 0;
        p["discountPrice"] = (Number(p.price ?? 0) - maxDiscount).toString();
        p["isSale"] =
          p.discountTagsIds?.length + p.productCollections.length > 0 &&
          (p.productCollections.some(
            (x) => x.product?.productId === p.productId && x.collection.isSale
          ) ||
            (p.discountTagsIds ?? "").split(", ").length > 0);
        p["iAmInterested"] = customerUserWishlist.some(
          (x) => x.product?.productId === p.productId
        );
        p["customerUserWishlist"] = customerUserWishlist.find(
          (x) => x.product?.productId === p.productId
        );
        return p;
      }),
      total,
    };
  }

  private async listCollections(data: any, customerUserId) {
    const qb = this.collectionRepository
      .createQueryBuilder("collection")
      .leftJoin("collection.productCollections", "productCollection")
      .leftJoin("productCollection.product", "product")
      .where('collection."Active" = true');

    // Optional Filters
    // Combine categories, collections, occasions, and tags into a single OR filter
    const orWhereExpressions: string[] = [];
    const orWhereParams: Record<string, any> = {};

    if (data?.categories?.length > 0) {
      data.categories.forEach((c: string, idx: number) => {
        orWhereExpressions.push(`LOWER(category."Name") LIKE :category${idx}`);
        orWhereParams[`category${idx}`] = `%${c.toLowerCase()}%`;
      });
    }
    if (data?.collections?.length > 0) {
      data.collections.forEach((c: string, idx: number) => {
        orWhereExpressions.push(
          `LOWER(collection."Name") LIKE :collection${idx}`
        );
        orWhereParams[`collection${idx}`] = `%${c.toLowerCase()}%`;
      });
    }
    if (data?.occasions?.length > 0 || data?.tags?.length > 0) {
      const tags = [...(data.occasions || []), ...(data.tags || [])];
      tags.forEach((tag: string, idx: number) => {
        orWhereExpressions.push(`LOWER(collection."Name") LIKE :tag${idx}`);
        orWhereParams[`tag${idx}`] = `%${tag.toLowerCase()}%`;
      });
    }

    if (data?.minPrice) {
      qb.andWhere('product."Price" >= :minPrice', { minPrice: data.minPrice });
    }
    if (data?.maxPrice) {
      qb.andWhere('product."Price" <= :maxPrice', { maxPrice: data.maxPrice });
    }

    if (data?.orderBy === "price") {
      qb.addSelect('MIN(product."Price")', "price")
        .groupBy('collection."CollectionId"')
        .addGroupBy('collection."Name"')
        .orderBy("price", data.orderDirection?.toUpperCase() || "ASC");
    } else if (data?.orderBy === "popularity_score") {
      qb.addSelect(
        `(SELECT COUNT(*) FROM dbo."CartItems" cart WHERE cart."ProductId" = product."ProductId") + (SELECT COUNT(*) FROM dbo."CustomerUserWishlist" wish WHERE wish."ProductId" = product."ProductId")`,
        "popularityScore"
      )
        .groupBy('collection."CollectionId"')
        .addGroupBy('collection."Name"')
        .orderBy(
          "popularityScore",
          data.orderDirection?.toUpperCase() || "DESC"
        );
    } else if (data?.orderBy === "order_count") {
      qb.addSelect(
        `(SELECT SUM(orderItem."Quantity") FROM dbo."OrderItems" orderItem WHERE orderItem."ProductId" = product."ProductId")`,
        "orderCount"
      )
        .groupBy('collection."CollectionId"')
        .addGroupBy('collection."Name"')
        .orderBy("orderCount", data.orderDirection?.toUpperCase() || "DESC");
    } else {
      qb.groupBy('collection."CollectionId"')
        .addGroupBy('collection."Name"')
        .orderBy('collection."SequenceId"', "ASC");
    }

    const collections = await qb.getRawMany();
    // return { collections: collections.map((c) => c.collection_name || c.name) };

    const collectionIds = collections.map((c) =>
      Number(c.collection_CollectionId ?? 0)
    );
    const collectionNames = collections.map((c) => c.collection_Name);

    const tags = [
      ...(data.categories || []),
      ...(data.collections || []),
      ...(data.occasions || []),
      ...(data.tags || []),
    ];
    const conditionForProductFocus = {
      active: true,
    } as any;
    if (tags.length > 0) {
      const productIds = await this.productService.advancedSearchProductIds(
        tags.join(" ")
      );

      if (productIds.length > 0) {
        conditionForProductFocus.productId = In(
          productIds.map((x) => Number(x))
        );
      }
    }

    const [products, total, customerUserWishlist, discounts] =
      await Promise.all([
        this.productRepository.find({
          where: [
            conditionForProductFocus,
            {
              category: {
                categoryId: In(collectionIds),
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
                categoryId: In(collectionIds),
              },
            },
          ],
        }),
        this.productRepository.manager.find(CustomerUserWishlist, {
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
        this.productRepository.manager.find(Discounts, {
          where: {
            active: true,
          },
        }),
      ]);

    return {
      collections: collectionNames,
      products: products.map((p) => {
        const maxDiscount =
          (p.discountTagsIds ?? "") !== ""
            ? Math.max(
              ...discounts
                .filter((d) =>
                  p.discountTagsIds.split(",").includes(d.discountId)
                )
                .map((d) =>
                  d.type === "PERCENTAGE"
                    ? (parseFloat(d.value) / 100) * Number(p.price ?? 0)
                    : parseFloat(d.value)
                )
            )
            : 0;
        p["discountPrice"] = (Number(p.price ?? 0) - maxDiscount).toString();
        p["isSale"] =
          p.discountTagsIds?.length + p.productCollections.length > 0 &&
          (p.productCollections.some(
            (x) => x.product?.productId === p.productId && x.collection.isSale
          ) ||
            (p.discountTagsIds ?? "").split(", ").length > 0);
        p["iAmInterested"] = customerUserWishlist.some(
          (x) => x.product?.productId === p.productId
        );
        p["customerUserWishlist"] = customerUserWishlist.find(
          (x) => x.product?.productId === p.productId
        );
        return p;
      }),
      total,
    };
  }

  private async listColors(data: any, customerUserId) {
    const qb = this.productRepository
      .createQueryBuilder("product")
      .leftJoin("product.productCollections", "productCollection")
      .leftJoin("productCollection.collection", "collection")
      .leftJoin("product.category", "category")
      .where('product."Active" = true')
      .andWhere('product."Color" IS NOT NULL');

    // Optional Filters
    // Combine categories, collections, occasions, and tags into a single OR filter
    const orWhereExpressions: string[] = [];
    const orWhereParams: Record<string, any> = {};

    if (data?.categories?.length > 0) {
      data.categories.forEach((c: string, idx: number) => {
        orWhereExpressions.push(`LOWER(category."Name") LIKE :category${idx}`);
        orWhereParams[`category${idx}`] = `%${c.toLowerCase()}%`;
      });
    }
    if (data?.collections?.length > 0) {
      data.collections.forEach((c: string, idx: number) => {
        orWhereExpressions.push(
          `LOWER(collection."Name") LIKE :collection${idx}`
        );
        orWhereParams[`collection${idx}`] = `%${c.toLowerCase()}%`;
      });
    }
    if (data?.occasions?.length > 0 || data?.tags?.length > 0) {
      const tags = [...(data.occasions || []), ...(data.tags || [])];
      tags.forEach((tag: string, idx: number) => {
        orWhereExpressions.push(`LOWER(collection."Name") LIKE :tag${idx}`);
        orWhereParams[`tag${idx}`] = `%${tag.toLowerCase()}%`;
      });
    }

    if (orWhereExpressions.length > 0) {
      qb.andWhere(orWhereExpressions.join(" OR "), orWhereParams);
    }
    if (data?.minPrice) {
      qb.andWhere('product."Price" >= :minPrice', { minPrice: data.minPrice });
    }
    if (data?.maxPrice) {
      qb.andWhere('product."Price" <= :maxPrice', { maxPrice: data.maxPrice });
    }

    if (data?.orderBy === "price") {
      qb.addSelect('MIN(product."Price")', "price")
        .groupBy('product."Color"')
        .addGroupBy('product."ProductId"')
        .orderBy("price", data.orderDirection?.toUpperCase() || "ASC");
    } else if (data?.orderBy === "popularity_score") {
      qb.addSelect(
        `(SELECT COUNT(*) FROM dbo."CartItems" cart WHERE cart."ProductId" = product."ProductId") + product."Interested"`,
        "popularityScore"
      )
        .groupBy('product."Color"')
        .addGroupBy('product."ProductId"')
        .orderBy(
          `product."Interested"`,
          data.orderDirection?.toUpperCase() || "DESC"
        );
    } else if (data?.orderBy === "order_count") {
      qb.addSelect(
        `(SELECT SUM(orderItem."Quantity") FROM dbo."OrderItems" orderItem WHERE orderItem."ProductId" = product."ProductId")`,
        "orderCount"
      )
        .groupBy('product."Color"')
        .addGroupBy('product."ProductId"')
        .orderBy("orderCount", data.orderDirection?.toUpperCase() || "DESC");
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
    } as any;
    if (tags.length > 0) {
      const productIds = await this.productService.advancedSearchProductIds(
        tags.join(" ")
      );

      if (productIds.length > 0) {
        conditionForProductFocus.productId = In(
          productIds.map((x) => Number(x))
        );
      }
    }

    const [products, total, customerUserWishlist, discounts] =
      await Promise.all([
        this.productRepository.find({
          where: [
            conditionForProductFocus,
            {
              color: In(colorNames),
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
              color: In(colorNames),
            },
          ],
        }),
        this.productRepository.manager.find(CustomerUserWishlist, {
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
        this.productRepository.manager.find(Discounts, {
          where: {
            active: true,
          },
        }),
      ]);

    return {
      colors: colorNames,
      products: products.map((p) => {
        const maxDiscount =
          (p.discountTagsIds ?? "") !== ""
            ? Math.max(
              ...discounts
                .filter((d) =>
                  p.discountTagsIds.split(",").includes(d.discountId)
                )
                .map((d) =>
                  d.type === "PERCENTAGE"
                    ? (parseFloat(d.value) / 100) * Number(p.price ?? 0)
                    : parseFloat(d.value)
                )
            )
            : 0;
        p["discountPrice"] = (Number(p.price ?? 0) - maxDiscount).toString();
        p["isSale"] =
          p.discountTagsIds?.length + p.productCollections.length > 0 &&
          (p.productCollections.some(
            (x) => x.product?.productId === p.productId && x.collection.isSale
          ) ||
            (p.discountTagsIds ?? "").split(", ").length > 0);
        p["iAmInterested"] = customerUserWishlist.some(
          (x) => x.product?.productId === p.productId
        );
        p["customerUserWishlist"] = customerUserWishlist.find(
          (x) => x.product?.productId === p.productId
        );
        return p;
      }),
      total,
    };
  }

  private async searchProducts(data: any, customerUserId: string) {
    const conditionForProductFocus: any = { active: true };
    const conditionCategoryFocus: any = { active: true };
    const productIds = await this.productService.advancedSearchProductIds(
      data.productName ?? ""
    );
    const categoryIds = await this.categoryService.advancedSearchCategoryIds(
      data.category ?? ""
    );
    if (productIds.length > 0) {
      conditionForProductFocus.productId = In(productIds.map((x) => Number(x)));
    }
    if (categoryIds.length > 0) {
      conditionCategoryFocus.category = {
        categoryId: In(categoryIds.map((x) => Number(x))),
        active: true,
      };
    }
    if (data.category) {
      conditionForProductFocus.category = {
        name: ILike(`%${data.category}%`),
        active: true,
      };
      conditionCategoryFocus.category = { name: ILike(`%${data.category}%`) };
    }
    // Handle price, maxPrice, minPrice logic
    if (data.price && !isNaN(Number(data.price)) && Number(data.price) > 0) {
      // If maxPrice is set and less than price, use price as maxPrice
      if (
        data.maxPrice &&
        !isNaN(Number(data.maxPrice)) &&
        Number(data.maxPrice) > 0
      ) {
        data.maxPrice = Math.max(Number(data.price), Number(data.maxPrice));
      } else {
        data.maxPrice = Number(data.price);
      }
      // If minPrice is set and less than price, use minPrice as min, else use price as min
      if (data.minPrice && !isNaN(Number(data.minPrice))) {
        data.minPrice = Math.max(Number(data.price), Number(data.minPrice));
      }
    } else {
      if (
        data.maxPrice &&
        !isNaN(Number(data.maxPrice)) &&
        Number(data.maxPrice) > 0
      ) {
        data.maxPrice = Number(data.maxPrice);
      }
      if (
        data.minPrice &&
        !isNaN(Number(data.minPrice)) &&
        Number(data.minPrice) > 0
      ) {
        data.minPrice = Number(data.minPrice);
      }
    }

    if (data.minPrice === data.maxPrice) {
      conditionForProductFocus.price = Between(0, Number(data.maxPrice));
      conditionCategoryFocus.price = Between(0, Number(data.maxPrice));
    } else {
      conditionForProductFocus.price = Between(
        Number(data.minPrice),
        Number(data.maxPrice)
      );
      conditionCategoryFocus.price = Between(
        Number(data.minPrice),
        Number(data.maxPrice)
      );
    }
    const [products, total, customerUserWishlist, discounts] =
      await Promise.all([
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
        this.productRepository.manager.find(CustomerUserWishlist, {
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
        this.productRepository.manager.find(Discounts, {
          where: {
            active: true,
          },
        }),
      ]);

    const suggestions = await this.generateSuggestionsHybridAndNonHybrid(
      data,
      customerUserId
    );

    return {
      products: products.map((p) => {
        const maxDiscount =
          (p.discountTagsIds ?? "") !== ""
            ? Math.max(
              ...discounts
                .filter((d) =>
                  p.discountTagsIds.split(",").includes(d.discountId)
                )
                .map((d) =>
                  d.type === "PERCENTAGE"
                    ? (parseFloat(d.value) / 100) * Number(p.price ?? 0)
                    : parseFloat(d.value)
                )
            )
            : 0;
        p["discountPrice"] = Number(p.price ?? 0) - maxDiscount;
        p["price"] = Number(p.price ?? 0) as any;
        p["isSale"] =
          p.discountTagsIds?.length + p.productCollections.length > 0 &&
          (p.productCollections.some(
            (x) => x.product?.productId === p.productId && x.collection.isSale
          ) ||
            (p.discountTagsIds ?? "").split(", ").length > 0);
        p["iAmInterested"] = customerUserWishlist.some(
          (x) => x.product?.productId === p.productId
        );
        p["customerUserWishlist"] = customerUserWishlist.find(
          (x) => x.product?.productId === p.productId
        );
        return p;
      }),
      total,
      suggestions,
    };
  }

  private async generateSuggestionsHybridAndNonHybrid(
    data: any,
    customerUserId
  ) {
    const hybridSuggestions: any = {};

    if (data.collections && data.collections.length > 0) {
      const availableCollections = await this.collectionRepository.find({
        where: {
          active: true,
          name: data.collections,
        },
      });
      hybridSuggestions.relatedCollections = availableCollections.map(
        (c) => c.name
      );
    }

    if (data.color && data.color.length > 0) {
      const availableColors = await this.productRepository
        .createQueryBuilder("product")
        .select(["product.color"])
        .where("product.active = :active", { active: true })
        .andWhere(
          data.color && data.color.length > 0
            ? `(${data.color
              .map(
                (_, idx) =>
                  `(LOWER(product."Color") LIKE :color${idx} OR LOWER(product."Name") LIKE :color${idx} OR LOWER(product."ShortDesc") LIKE :color${idx} OR LOWER(product."LongDesc") LIKE :color${idx})`
              )
              .join(" OR ")})`
            : "1=1",
          data.color && data.color.length > 0
            ? Object.fromEntries(
              data.color.map((c: string, idx: number) => [
                `color${idx}`,
                `%${c.toLowerCase()}%`,
              ])
            )
            : {}
        )
        .getRawMany();

      // Only include colors that are in data.color (case-insensitive)
      const colorSet = new Set(
        (data.color || []).map((c: string) => c.trim().toLowerCase())
      );
      hybridSuggestions.availableColors = Array.from(
        new Set(
          availableColors
            .map((c) => c.product_Color)
            .filter(
              (color: string) =>
                color && colorSet.has(color.trim().toLowerCase())
            )
        )
      );
    }

    // Hot Picks and Best Sellers Query
    const [hotPicksRaw, bestSellersRaw] = await Promise.all([
      this.productRepository
        .createQueryBuilder("product")
        .leftJoin(
          CartItems,
          "cart",
          '"cart"."ProductId" = "product"."ProductId"'
        )
        .leftJoin(
          CustomerUserWishlist,
          "wishlist",
          '"wishlist"."ProductId" = "product"."ProductId"'
        )
        .select('"product"."ProductId"', "productId")
        .addSelect(
          'COUNT("cart"."CartItemId") + COUNT("wishlist"."CustomerUserWishlistId")',
          "popularityScore"
        )
        .where('"product"."Active" = true')
        .groupBy('"product"."ProductId"')
        .addGroupBy('"product"."Name"')
        .orderBy(
          'COUNT("cart"."CartItemId") + COUNT("wishlist"."CustomerUserWishlistId")',
          "DESC"
        )
        .limit(5)
        .getRawMany(),

      this.productRepository
        .createQueryBuilder("product")
        .leftJoin(
          OrderItems,
          "orderItem",
          '"orderItem"."ProductId" = "product"."ProductId"'
        )
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
          .filter(
            (p) =>
              p.popularityScore !== null && parseInt(p.popularityScore, 10) > 0
          )
          .map((p) => ({
            productId: p.productId,
            popularityScore: parseInt(p.popularityScore, 10),
          })),
        bestSellers: bestSellersRaw
          .filter(
            (p) => p.orderCount !== null && parseInt(p.orderCount, 10) > 0
          )
          .map((p) => ({
            productId: p.productId,
            totalOrders: parseInt(p.orderCount, 10),
          })),
      },
    };
  }

  private async listTrends(customerUserId) {
    const { nonHybridSuggestions } =
      await this.generateSuggestionsHybridAndNonHybrid({}, customerUserId);
    return nonHybridSuggestions;
  }
}
