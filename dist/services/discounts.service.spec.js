"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const discounts_service_1 = require("./discounts.service");
describe("DiscountsService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [discounts_service_1.DiscountsService],
        }).compile();
        service = module.get(discounts_service_1.DiscountsService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=discounts.service.spec.js.map