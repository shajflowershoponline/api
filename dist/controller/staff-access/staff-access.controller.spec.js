"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const staff_access_controller_1 = require("./staff-access.controller");
describe("StaffAccessController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [staff_access_controller_1.StaffAccessController],
        }).compile();
        controller = module.get(staff_access_controller_1.StaffAccessController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=staff-access.controller.spec.js.map