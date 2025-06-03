"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const discounts_controller_1 = require("./discounts.controller");
describe("DiscountsController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [discounts_controller_1.DiscountsController],
        }).compile();
        controller = module.get(discounts_controller_1.DiscountsController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=discounts.controller.spec.js.map