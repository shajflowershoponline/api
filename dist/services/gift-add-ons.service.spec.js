"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const gift_add_ons_service_1 = require("./gift-add-ons.service");
describe("GiftAddOnsService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [gift_add_ons_service_1.GiftAddOnsService],
        }).compile();
        service = module.get(gift_add_ons_service_1.GiftAddOnsService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=gift-add-ons.service.spec.js.map