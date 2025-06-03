import { Test, TestingModule } from "@nestjs/testing";
import { AIController } from "./ai.controller";

describe("AIController", () => {
  let controller: AIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AIController],
    }).compile();

    controller = module.get<AIController>(AIController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
