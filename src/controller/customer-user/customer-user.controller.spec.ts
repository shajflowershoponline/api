import { Test, TestingModule } from "@nestjs/testing";
import { CustomerUserController } from "./customer-user.controller";

describe("CustomerUserController", () => {
  let controller: CustomerUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerUserController],
    }).compile();

    controller = module.get<CustomerUserController>(CustomerUserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
