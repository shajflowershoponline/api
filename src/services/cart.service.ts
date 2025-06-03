import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CART_ITEM_ERROR_DELETED,
  CART_ITEM_ERROR_NOT_FOUND,
} from "src/common/constant/cart-error.constant";
import { CUSTOMER_USER_ERROR_USER_NOT_FOUND } from "src/common/constant/customer-user-error.constant";
import { DISCOUNT_ERROR_NOT_FOUND } from "src/common/constant/discounts.constant";
import { getDate } from "src/common/utils/utils";
import { CartCustomerCouponDto } from "src/core/dto/cart-item/cart-customer-coupon.dto";
import { CreateCartItemDto } from "src/core/dto/cart-item/cart-item.create.dto";
import { UpdateCartDto } from "src/core/dto/cart-item/cart-item.update.dto";
import { CartItems } from "src/db/entities/CartItems";
import { CustomerCoupon } from "src/db/entities/CustomerCoupon";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { Discounts } from "src/db/entities/Discounts";
import { Product } from "src/db/entities/Product";
import { Repository } from "typeorm";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItems)
    private readonly cartItemsRepo: Repository<CartItems>
  ) {}

  async getItems(customerUserId) {
    const results = await this.cartItemsRepo.find({
      where: {
        customerUser: {
          customerUserId,
        },
        active: true,
      },
      relations: {
        product: {
          productImages: {
            file: true,
          },
        },
      },
    });
    return results;
  }

  async create(dto: CreateCartItemDto) {
    return await this.cartItemsRepo.manager.transaction(
      async (entityManager) => {
        try {
          let cartItem = await entityManager.findOne(CartItems, {
            where: {
              product: {
                productId: dto.productId,
              },
              active: true,
            },
            relations: {
              product: true,
              customerUser: true,
            },
          });
          if (!cartItem) {
            cartItem = new CartItems();
            const product = await entityManager.findOne(Product, {
              where: {
                productId: dto.productId,
                active: true,
              },
            });
            if (!product) {
              throw Error("Product not found");
            }
            cartItem.product = product;
            const customerUser = await entityManager.findOne(CustomerUser, {
              where: {
                customerUserId: dto.customerUserId,
                active: true,
              },
            });
            if (!customerUser) {
              throw Error("Customer user not found");
            }
            cartItem.customerUser = customerUser;
            cartItem.quantity = dto.quantity;
            if (Number(product.price) !== Number(dto.price)) {
              throw Error("Invalid price");
            }
            cartItem.createdAt = await getDate();
          } else {
            cartItem.quantity = (
              Number(cartItem.quantity ?? 0) + Number(dto.quantity ?? 0)
            ).toString();
            cartItem.product = await entityManager.findOne(Product, {
              where: {
                productId: dto.productId,
              },
            });
            if (Number(cartItem?.product.price) !== Number(dto.price)) {
              throw Error("Invalid price");
            }
            cartItem.updatedAt = await getDate();
          }
          cartItem.price = dto.price;
          cartItem = await entityManager.save(CartItems, cartItem);
          return cartItem;
        } catch (ex) {
          throw ex;
        }
      }
    );
  }

  async update(dto: UpdateCartDto) {
    return await this.cartItemsRepo.manager.transaction(
      async (entityManager) => {
        // Step 1: Fetch all active cart items of the customer
        const existingItems = await entityManager.find(CartItems, {
          where: {
            customerUser: { customerUserId: dto.customerUserId },
            active: true,
          },
        });

        // Step 2: Map existing items by cartItemId for quick access
        const existingMap = new Map(
          existingItems.map((item) => [item.cartItemId, item])
        );

        const updatedItems: CartItems[] = [];

        // Step 3: Process each item from the incoming DTO
        for (const item of dto.items) {
          const existingItem = existingMap.get(item.cartItemId);

          if (!existingItem) {
            throw new Error(CART_ITEM_ERROR_NOT_FOUND); // Not found in current cart
          }
          if (!existingItem.active) {
            throw new Error(CART_ITEM_ERROR_DELETED); // Already marked as deleted
          }

          existingItem.quantity = item.quantity;

          // Deactivate if quantity is zero or less
          if (Number(item.quantity) <= 0) {
            existingItem.active = false;
          }
          existingItem.updatedAt = await getDate();
          const savedItem = await entityManager.save(CartItems, existingItem);
          updatedItems.push(savedItem);

          existingMap.delete(item.cartItemId); // Mark as processed
        }

        // Step 4: Remove any items that were NOT in the incoming DTO
        const itemsToRemove = Array.from(existingMap.values());
        for (const item of itemsToRemove) {
          item.updatedAt = await getDate();
          await entityManager.remove(CartItems, item);
        }

        return updatedItems;
      }
    );
  }

  async manageCoupon(dto: CartCustomerCouponDto) {
    return await this.cartItemsRepo.manager.transaction(
      async (entityManager) => {
        const customerUser = await entityManager.findOne(CustomerUser, {
          where: {
            customerUserId: dto.customerUserId,
            active: true,
          },
        });

        if (!customerUser) {
          throw Error(CUSTOMER_USER_ERROR_USER_NOT_FOUND);
        }

        if (dto.promoCode && dto.promoCode !== "") {
          const discount = await entityManager.findOne(Discounts, {
            where: {
              promoCode: dto.promoCode,
              active: true,
            },
          });

          if (!discount) {
            throw Error(
              "The coupon code you entered is invalid or has expired. Please try again."
            );
          }

          const cartItems = await entityManager
            .createQueryBuilder(CartItems, "cartItem")
            .innerJoin("cartItem.product", "product")
            .where(
              `(',' || product."DiscountTagsIds" || ',') LIKE :discountid`,
              {
                discountid: `%,${discount.discountId},%`,
              }
            )
            .getMany();

          if (cartItems.length === 0) {
            throw Error(
              "The entered promo code is not valid for any items in your cart."
            );
          }

          let customerCoupon = await entityManager.findOne(CustomerCoupon, {
            where: {
              customerUser: {
                customerUserId: dto.customerUserId,
              },
              discount: {
                promoCode: dto.promoCode,
              },
            },
            relations: {
              discount: true,
            },
          });
          if (!customerCoupon) {
            customerCoupon = new CustomerCoupon();
            customerCoupon.customerUser = customerUser;
            customerCoupon.discount = discount;
          }
          customerCoupon = await entityManager.save(
            CustomerCoupon,
            customerCoupon
          );
          return await entityManager.findOne(CustomerCoupon, {
            where: {
              customerUser: {
                customerUserId: dto.customerUserId,
              },
              discount: {
                promoCode: dto.promoCode,
              },
              active: true,
            },
            relations: {
              discount: true,
            },
          });
        } else {
          let customerCoupon = await entityManager.findOne(CustomerCoupon, {
            where: {
              customerUser: {
                customerUserId: dto.customerUserId,
              },
              active: true,
            },
            relations: {
              discount: true,
            },
          });

          if (!customerCoupon) {
            customerCoupon = new CustomerCoupon();
            customerCoupon.customerUser = customerUser;
          } else {
            customerCoupon.discount = null;
          }
          customerCoupon = await entityManager.save(
            CustomerCoupon,
            customerCoupon
          );
          return await entityManager.findOne(CustomerCoupon, {
            where: {
              customerUser: {
                customerUserId: dto.customerUserId,
              },
              active: true,
            },
            relations: {
              discount: true,
            },
          });
        }
      }
    );
  }

  async getActiveCoupon(customerUserId) {
    const results = await this.cartItemsRepo.manager.findOne(CustomerCoupon, {
      where: {
        customerUser: {
          customerUserId,
        },
        discount: {
          active: true,
        },
        active: true,
      },
      relations: {
        customerUser: true,
        discount: true,
      },
    });
    return results;
  }
}
