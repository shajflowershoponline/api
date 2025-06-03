"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const order_controller_1 = require("./order.controller");
describe('OrderController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [order_controller_1.OrderController],
        }).compile();
        controller = module.get(order_controller_1.OrderController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=order.controller.spec.js.map