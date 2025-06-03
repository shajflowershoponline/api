import { Test, TestingModule } from '@nestjs/testing';
import { CustomerUserWishListService } from './customer-user-wish-list.service';

describe('CustomerUserWishListService', () => {
  let service: CustomerUserWishListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerUserWishListService],
    }).compile();

    service = module.get<CustomerUserWishListService>(CustomerUserWishListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
