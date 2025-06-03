"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const staff_user_service_1 = require("./staff-user.service");
describe("StaffUserService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [staff_user_service_1.StaffUserService],
        }).compile();
        service = module.get(staff_user_service_1.StaffUserService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=staff-user.service.spec.js.map