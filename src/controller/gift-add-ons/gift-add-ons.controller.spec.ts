import { Test, TestingModule } from "@nestjs/testing";
import { GiftAddOnsController } from "./gift-add-ons.controller";

describe("GiftAddOnsController", () => {
  let controller: GiftAddOnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftAddOnsController],
    }).compile();

    controller = module.get<GiftAddOnsController>(GiftAddOnsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
