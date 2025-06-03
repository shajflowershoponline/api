"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const customer_user_controller_1 = require("./customer-user.controller");
describe("CustomerUserController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [customer_user_controller_1.CustomerUserController],
        }).compile();
        controller = module.get(customer_user_controller_1.CustomerUserController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=customer-user.controller.spec.js.map