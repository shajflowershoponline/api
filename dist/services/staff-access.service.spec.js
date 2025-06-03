"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const staff_access_service_1 = require("./staff-access.service");
describe("StaffAccessService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [staff_access_service_1.StaffAccessService],
        }).compile();
        service = module.get(staff_access_service_1.StaffAccessService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=staff-access.service.spec.js.map