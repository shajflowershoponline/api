"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const product_controller_1 = require("./product.controller");
describe("ProductController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [product_controller_1.ProductController],
        }).compile();
        controller = module.get(product_controller_1.ProductController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=product.controller.spec.js.map