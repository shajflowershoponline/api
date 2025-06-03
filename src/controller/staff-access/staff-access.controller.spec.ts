import { Test, TestingModule } from "@nestjs/testing";
import { StaffAccessController } from "./staff-access.controller";

describe("StaffAccessController", () => {
  let controller: StaffAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffAccessController],
    }).compile();

    controller = module.get<StaffAccessController>(StaffAccessController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
