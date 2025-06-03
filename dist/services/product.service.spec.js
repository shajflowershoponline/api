"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const product_service_1 = require("./product.service");
describe("ProductService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [product_service_1.ProductService],
        }).compile();
        service = module.get(product_service_1.ProductService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=product.service.spec.js.map