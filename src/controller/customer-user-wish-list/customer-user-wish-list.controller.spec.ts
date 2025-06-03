import { Test, TestingModule } from '@nestjs/testing';
import { CustomerUserWishListController } from './customer-user-wish-list.controller';

describe('CustomerUserWishListController', () => {
  let controller: CustomerUserWishListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerUserWishListController],
    }).compile();

    controller = module.get<CustomerUserWishListController>(CustomerUserWishListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
