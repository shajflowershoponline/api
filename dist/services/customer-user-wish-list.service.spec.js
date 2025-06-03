"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const customer_user_wish_list_service_1 = require("./customer-user-wish-list.service");
describe('CustomerUserWishListService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [customer_user_wish_list_service_1.CustomerUserWishListService],
        }).compile();
        service = module.get(customer_user_wish_list_service_1.CustomerUserWishListService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=customer-user-wish-list.service.spec.js.map