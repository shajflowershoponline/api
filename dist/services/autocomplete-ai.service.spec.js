"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const autocomplete_ai_service_1 = require("./autocomplete-ai.service");
describe('AutocompleteAiService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [autocomplete_ai_service_1.AutocompleteAiService],
        }).compile();
        service = module.get(autocomplete_ai_service_1.AutocompleteAiService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=autocomplete-ai.service.spec.js.map