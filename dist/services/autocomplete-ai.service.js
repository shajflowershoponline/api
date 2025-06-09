"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteAiService = void 0;
const common_1 = require("@nestjs/common");
let AutocompleteAiService = class AutocompleteAiService {
    constructor() {
        this.products = [
            "Red Roses Bouquet",
            "Sunflower Vase",
            "Mother's Day Combo",
            "White Lily Sympathy Basket",
            "Orchid in Vase",
            "Luxury Rose Dome Box",
        ];
        this.vectors = [];
    }
    async onModuleInit() {
        const { pipeline } = await Promise.resolve().then(() => __importStar(require("@xenova/transformers")));
        this.encoder = await pipeline("feature-extraction", "Xenova/bge-small-en");
        const embeddings = await Promise.all(this.products.map((p) => this.encoder(p)));
        this.vectors = embeddings.map((e) => e.data[0]);
    }
    cosineSimilarity(a, b) {
        const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
        const normA = Math.sqrt(a.reduce((s, ai) => s + ai ** 2, 0));
        const normB = Math.sqrt(b.reduce((s, bi) => s + bi ** 2, 0));
        return dot / (normA * normB);
    }
    async suggest(query) {
        const queryEmbedding = await this.encoder(query);
        const qVec = queryEmbedding.data[0];
        return this.products
            .map((title, i) => ({
            title,
            score: this.cosineSimilarity(qVec, this.vectors[i]),
        }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }
};
AutocompleteAiService = __decorate([
    (0, common_1.Injectable)()
], AutocompleteAiService);
exports.AutocompleteAiService = AutocompleteAiService;
//# sourceMappingURL=autocomplete-ai.service.js.map