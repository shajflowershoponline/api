"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const delivery_controller_1 = require("./delivery.controller");
describe('DeliveryController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [delivery_controller_1.DeliveryController],
        }).compile();
        controller = module.get(delivery_controller_1.DeliveryController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=delivery.controller.spec.js.map