import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { extname } from "path";
import { ORDER_ERROR_NOT_FOUND } from "src/common/constant/order.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
  getDate,
  toCamelCase,
} from "src/common/utils/utils";
import { CreateOrderDto } from "src/core/dto/order/order.create.dto";
import { CartItems } from "src/db/entities/CartItems";
import { Category } from "src/db/entities/Category";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { Discounts } from "src/db/entities/Discounts";
import { GiftAddOns } from "src/db/entities/GiftAddOns";
import { Order } from "src/db/entities/Order";
import { OrderItems } from "src/db/entities/OrderItems";
import { Repository, In, Brackets } from "typeorm";
import { DeliveryService } from "./delivery.service";
import { ConfigService } from "@nestjs/config";
import { CustomerCoupon } from "src/db/entities/CustomerCoupon";
import {
  UpdateOrderStatusDto,
  UpdateStatusEnums,
} from "src/core/dto/order/order.update.dto";
import { Collection } from "src/db/entities/Collection";

@Injectable()
export class OrderService {
  private STORE_LOCATION_COORDINATES: { lat: number; lng: number };
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly deliveryService: DeliveryService,
    private readonly config: ConfigService
  ) {
    const coordinates = this.config.get<string>("STORE_LOCATION_COORDINATES");
    this.STORE_LOCATION_COORDINATES = {
      lat: parseFloat(coordinates.split(",")[0] || "0"),
      lng: parseFloat(coordinates.split(",")[1] || "0"),
    };
  }

  async getByCustomerUser({ customerUserId, pageSize, pageIndex, keywords }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);
    keywords = keywords ?? "";

    const query = this.orderRepo
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.customerUser", "customerUser")
      .leftJoinAndSelect("order.orderItems", "orderItems")
      .leftJoinAndSelect("orderItems.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.productCollections", "productCollections")
      .where('"order"."Active" = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            `
          "order"."CustomerUserId" = :customerUserId AND
          (
            "product"."SKU" ILIKE :keywords OR 
            "product"."Name" ILIKE :keywords OR 
            "product"."ShortDesc" ILIKE :keywords OR 
            "product"."LongDesc" ILIKE :keywords OR 
            "category"."Name" ILIKE :keywords OR 
            "category"."Desc" ILIKE :keywords
          )
          `,
            {
              keywords: `%${keywords}%`,
              customerUserId,
            }
          );
        })
      );

    const queryResults = take > 0 ? query.skip(skip).take(take) : query;

    const [results, total] = await Promise.all([
      queryResults.getMany(),
      query.getCount(),
    ]);

    return {
      results,
      total,
    };
  }

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.orderRepo.find({
        where: {
          ...condition,
          active: true,
        },
        relations: {
          customerUser: true,
          orderItems: {
            product: {
              category: true,
              productCollections: true,
            },
          },
        },
        skip,
        take,
        order,
      }),
      this.orderRepo.count({
        where: {
          ...condition,
          active: true,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getByOrderCode(orderCode) {
    const result = await this.orderRepo.findOne({
      where: {
        orderCode,
        active: true,
      },
      relations: {
        orderItems: {
          product: {
            productImages: {
              file: true,
            },
            category: {
              thumbnailFile: true,
            },
          },
        },
      },
    });
    if (!result) {
      throw Error(ORDER_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateOrderDto) {
    return await this.orderRepo.manager.transaction(async (entityManager) => {
      try {
        let order = new Order();
        const customerUser = await entityManager.findOne(CustomerUser, {
          where: {
            customerUserId: dto.customerUserId,
          },
          relations: {},
        });
        if (!customerUser) {
          throw Error(ORDER_ERROR_NOT_FOUND);
        }
        order.customerUser = customerUser;
        order.name = customerUser.name;
        order.email = dto.email;
        order.mobileNumber = dto.mobileNumber;
        order.paymentMethod = dto.paymentMethod;
        order.createdAt = await getDate();
        order.deliveryAddress =
          await this.deliveryService.getAddressNameFromCoordinates(
            dto.deliveryAddressCoordinates.lat,
            dto.deliveryAddressCoordinates.lng
          );
        order.deliveryAddressCoordinates = dto.deliveryAddressCoordinates;

        order.specialInstructions = dto.specialInstructions || null;
        order.notesToRider = dto.notesToRider || null;

        order = await entityManager.save(Order, order);
        let subtotal = 0;

        let cartItems: CartItems[] = [];
        let netDiscountAmount = 0;

        const currentDiscount = await entityManager.findOne(CustomerCoupon, {
          where: {
            customerUser: {
              customerUserId: dto.customerUserId,
            },
          },
          relations: {
            discount: true,
          },
        });

        if (dto.cartItemIds && dto.cartItemIds.length > 0) {
          cartItems = await entityManager.find(CartItems, {
            where: {
              cartItemId: In(dto.cartItemIds),
              active: true,
            },
            relations: {
              product: {
                productImages: {
                  file: true,
                },
                category: {
                  thumbnailFile: true,
                },
              },
            },
          });

          subtotal = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price || "0");
            const quantity = parseFloat(item.quantity || "1");
            return sum + quantity * price;
          }, 0);

          const collections = await entityManager.find(Collection, {
            where: {
              productCollections: {
                product: {
                  productId: In(dto.cartItemIds.map((id) => Number(id))),
                },
                active: true,
              },
              isSale: true,
              active: true,
            },
            relations: {
              productCollections: {
                product: true,
              },
            },
          });

          const orderItems: OrderItems[] = [];
          for (const cartItem of cartItems) {
            const orderItem = new OrderItems();
            orderItem.product = cartItem.product;
            orderItem.order = order;
            orderItem.quantity = cartItem.quantity;
            orderItem.price = cartItem.price;
            const itemTotalAmount =
              Number(cartItem.price ?? 0) *
              Number(Number(cartItem.quantity ?? 0));

            const discountTagsIds = [
              cartItem.product.discountTagsIds,
              ...collections
                ?.filter((c) =>
                  c.productCollections?.find(
                    (pc) =>
                      pc.product?.productId === cartItem.product?.productId
                  )
                )
                .map((c) => c.discountTagsIds),
            ];

            if (
              discountTagsIds.includes(currentDiscount?.discount?.discountId)
            ) {
              const discountAmount =
                currentDiscount?.discount?.type === "PERCENTAGE"
                  ? (parseFloat(currentDiscount?.discount?.value) / 100) *
                    itemTotalAmount
                  : parseFloat(currentDiscount?.discount?.value);
              orderItem.totalAmount = (
                itemTotalAmount - discountAmount
              ).toString();
              netDiscountAmount =
                netDiscountAmount + Number(orderItem.totalAmount);
            } else {
              orderItem.totalAmount = itemTotalAmount.toString();
            }
            orderItems.push(orderItem);

            cartItem.active = false;
            cartItem.updatedAt = await getDate();
          }
          await entityManager.save(OrderItems, orderItems);
          await entityManager.save(CartItems, cartItems);
        }
        order.subtotal = subtotal.toString();
        order.discount = (subtotal - netDiscountAmount).toString();
        const delivery = await this.deliveryService.calculateDeliveryFee(
          this.STORE_LOCATION_COORDINATES,
          dto.deliveryAddressCoordinates as { lat: number; lng: number }
        );
        order.deliveryFee = delivery.deliveryFee.toString();
        order.total = (netDiscountAmount + delivery.deliveryFee).toString();
        order.orderCode = generateIndentityCode(order.orderId);
        order = await entityManager.save(Order, order);
        order = await entityManager.findOne(Order, {
          where: {
            orderId: order.orderId,
          },
          relations: {
            orderItems: {
              product: {
                thumbnailFile: true,
                category: true,
              },
            },
            customerUser: true,
          },
        });
        return order;
      } catch (ex) {
        throw ex;
      }
    });
  }

  async updateStatus(orderCode, dto: UpdateOrderStatusDto) {
    return await this.orderRepo.manager.transaction(async (entityManager) => {
      try {
        let order = await entityManager.findOne(Order, {
          where: {
            orderCode: orderCode,
            active: true,
          },
          relations: {
            customerUser: true,
          },
        });
        if (!order) {
          throw Error(ORDER_ERROR_NOT_FOUND);
        }

        if (
          order.status === dto.status &&
          dto.status === UpdateStatusEnums.DELIVERY
        ) {
          throw Error("Order already in delivery");
        }

        if (
          order.status === dto.status &&
          dto.status === UpdateStatusEnums.CANCELLED
        ) {
          throw Error("Order already in delivery");
        }

        if (
          order.status === dto.status &&
          dto.status === UpdateStatusEnums.COMPLETED
        ) {
          throw Error("Order already in delivery");
        }

        if (
          order.status === UpdateStatusEnums.COMPLETED &&
          (dto.status === UpdateStatusEnums.DELIVERY ||
            dto.status === UpdateStatusEnums.CANCELLED)
        ) {
          throw Error("Order already in compeleted");
        }

        if (
          order.status === UpdateStatusEnums.DELIVERY &&
          (dto.status === UpdateStatusEnums.CANCELLED ||
            dto.status === UpdateStatusEnums.COMPLETED)
        ) {
          throw Error("Order already in delivery");
        }

        if (
          order.status === UpdateStatusEnums.CANCELLED &&
          (dto.status === UpdateStatusEnums.DELIVERY ||
            dto.status === UpdateStatusEnums.COMPLETED)
        ) {
          throw Error("Order already in cancelled");
        }

        order.status = dto.status;
        order = await entityManager.save(Order, order);
        return order;
      } catch (ex) {
        throw ex;
      }
    });
  }
}
