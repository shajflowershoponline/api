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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerUserAiSearch = void 0;
const typeorm_1 = require("typeorm");
const CustomerUser_1 = require("./CustomerUser");
let CustomerUserAiSearch = class CustomerUserAiSearch {
};
__decorate([
    (0, typeorm_1.Column)("uuid", { primary: true, name: "CustomerUserAISearchId" }),
    __metadata("design:type", String)
], CustomerUserAiSearch.prototype, "customerUserAiSearchId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateTime" }),
    __metadata("design:type", Date)
], CustomerUserAiSearch.prototype, "dateTime", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Intent" }),
    __metadata("design:type", String)
], CustomerUserAiSearch.prototype, "intent", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { name: "Data", default: {} }),
    __metadata("design:type", Object)
], CustomerUserAiSearch.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Prompt" }),
    __metadata("design:type", String)
], CustomerUserAiSearch.prototype, "prompt", void 0);
__decorate([
    (0, typeorm_1.Column)("text", {
        name: "SuggestionsRelatedCollections",
        array: true,
        default: () => "'{}'[]",
    }),
    __metadata("design:type", Array)
], CustomerUserAiSearch.prototype, "suggestionsRelatedCollections", void 0);
__decorate([
    (0, typeorm_1.Column)("text", {
        name: "SuggestionsAvailableColors",
        array: true,
        default: () => "'{}'[]",
    }),
    __metadata("design:type", Array)
], CustomerUserAiSearch.prototype, "suggestionsAvailableColors", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { name: "HotPicks", default: [] }),
    __metadata("design:type", Object)
], CustomerUserAiSearch.prototype, "hotPicks", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { name: "BestSellers", default: [] }),
    __metadata("design:type", Object)
], CustomerUserAiSearch.prototype, "bestSellers", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CustomerUser_1.CustomerUser, (customerUser) => customerUser.customerUserAiSearches),
    (0, typeorm_1.JoinColumn)([
        { name: "CustomerUserId", referencedColumnName: "customerUserId" },
    ]),
    __metadata("design:type", CustomerUser_1.CustomerUser)
], CustomerUserAiSearch.prototype, "customerUser", void 0);
CustomerUserAiSearch = __decorate([
    (0, typeorm_1.Index)("CustomerUserAISearch_pkey", ["customerUserAiSearchId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("CustomerUserAISearch", { schema: "dbo" })
], CustomerUserAiSearch);
exports.CustomerUserAiSearch = CustomerUserAiSearch;
//# sourceMappingURL=CustomerUserAiSearch.js.map