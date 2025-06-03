"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const customer_user_wish_list_controller_1 = require("./customer-user-wish-list.controller");
describe('CustomerUserWishListController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [customer_user_wish_list_controller_1.CustomerUserWishListController],
        }).compile();
        controller = module.get(customer_user_wish_list_controller_1.CustomerUserWishListController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=customer-user-wish-list.controller.spec.js.map