import { Test, TestingModule } from "@nestjs/testing";
import { ProductCollectionController } from "./product-collection.controller";

describe("ProductCollectionController", () => {
  let controller: ProductCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCollectionController],
    }).compile();

    controller = module.get<ProductCollectionController>(
      ProductCollectionController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
