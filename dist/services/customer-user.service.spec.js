"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const customer_user_service_1 = require("./customer-user.service");
describe("CustomerUserService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [customer_user_service_1.CustomerUserService],
        }).compile();
        service = module.get(customer_user_service_1.CustomerUserService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=customer-user.service.spec.js.map