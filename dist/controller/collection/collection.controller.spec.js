"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const collection_controller_1 = require("./collection.controller");
describe("CollectionController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [collection_controller_1.CollectionController],
        }).compile();
        controller = module.get(collection_controller_1.CollectionController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=collection.controller.spec.js.map