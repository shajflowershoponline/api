import { Test, TestingModule } from "@nestjs/testing";
import { StaffAccessService } from "./staff-access.service";

describe("StaffAccessService", () => {
  let service: StaffAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffAccessService],
    }).compile();

    service = module.get<StaffAccessService>(StaffAccessService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
