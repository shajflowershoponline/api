"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const gift_add_ons_controller_1 = require("./gift-add-ons.controller");
describe("GiftAddOnsController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [gift_add_ons_controller_1.GiftAddOnsController],
        }).compile();
        controller = module.get(gift_add_ons_controller_1.GiftAddOnsController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=gift-add-ons.controller.spec.js.map