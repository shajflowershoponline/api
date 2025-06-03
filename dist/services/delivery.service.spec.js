"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const delivery_service_1 = require("./delivery.service");
describe('DeliveryService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [delivery_service_1.DeliveryService],
        }).compile();
        service = module.get(delivery_service_1.DeliveryService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=delivery.service.spec.js.map