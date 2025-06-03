"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const collection_service_1 = require("./collection.service");
describe("CollectionService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [collection_service_1.CollectionService],
        }).compile();
        service = module.get(collection_service_1.CollectionService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=collection.service.spec.js.map