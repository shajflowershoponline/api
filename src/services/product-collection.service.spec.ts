import { Test, TestingModule } from "@nestjs/testing";
import { ProductCollectionService } from "./product-collection.service";

describe("ProductCollectionService", () => {
  let service: ProductCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCollectionService],
    }).compile();

    service = module.get<ProductCollectionService>(ProductCollectionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
