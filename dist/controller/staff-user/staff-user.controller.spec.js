"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const staff_user_controller_1 = require("./staff-user.controller");
describe("StaffUserController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [staff_user_controller_1.StaffUserController],
        }).compile();
        controller = module.get(staff_user_controller_1.StaffUserController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=staff-user.controller.spec.js.map