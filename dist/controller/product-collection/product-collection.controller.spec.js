"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const product_collection_controller_1 = require("./product-collection.controller");
describe("ProductCollectionController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [product_collection_controller_1.ProductCollectionController],
        }).compile();
        controller = module.get(product_collection_controller_1.ProductCollectionController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=product-collection.controller.spec.js.map