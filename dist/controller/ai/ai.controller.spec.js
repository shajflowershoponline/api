"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ai_controller_1 = require("./ai.controller");
describe("AIController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [ai_controller_1.AIController],
        }).compile();
        controller = module.get(ai_controller_1.AIController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=ai.controller.spec.js.map