import { Test, TestingModule } from "@nestjs/testing";
import { GiftAddOnsService } from "./gift-add-ons.service";

describe("GiftAddOnsService", () => {
  let service: GiftAddOnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiftAddOnsService],
    }).compile();

    service = module.get<GiftAddOnsService>(GiftAddOnsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
