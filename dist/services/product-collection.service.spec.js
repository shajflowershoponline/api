"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const product_collection_service_1 = require("./product-collection.service");
describe("ProductCollectionService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [product_collection_service_1.ProductCollectionService],
        }).compile();
        service = module.get(product_collection_service_1.ProductCollectionService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=product-collection.service.spec.js.map