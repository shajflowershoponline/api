import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { extname } from "path";
import { CUSTOMER_USER_ERROR_USER_NOT_FOUND } from "src/common/constant/customer-user-error.constant";
import {
  CUSTOMERUSERWISHLIST_ERROR_NOT_FOUND,
  CUSTOMERUSERWISHLIST_ERROR_DUPLICATE,
} from "src/common/constant/discounts.constant copy";
import { PRODUCT_ERROR_NOT_FOUND } from "src/common/constant/product.constant";
import { getDate, toCamelCase } from "src/common/utils/utils";
import { CreateCustomerUserWishlistDto } from "src/core/dto/customer-user-wish-list/customer-user-wish-list.create.dto";
import { UpdateCustomerUserWishlistDto } from "src/core/dto/customer-user-wish-list/customer-user-wish-list.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { CustomerUserWishlist } from "src/db/entities/CustomerUserWishlist";
import { Product } from "src/db/entities/Product";
import { Repository, Brackets } from "typeorm";

@Injectable()
export class CustomerUserWishListService {
  constructor(
    @InjectRepository(CustomerUserWishlist)
    private readonly customerUserWishlistRepo: Repository<CustomerUserWishlist>
  ) {}

  async getPagination({
    customerUserId,
    pageSize,
    pageIndex,
    order,
    keywords,
  }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    let field = "customerUserWishlist.dateTime";
    let direction: "ASC" | "DESC" = "ASC";

    if (order) {
      const [rawField, rawDirection] = Object.entries(order)[0];
      field = `customerUserWishlist.${toCamelCase(rawField)}`;
      const upperDir = String(rawDirection).toUpperCase();
      direction = upperDir === "ASC" ? "ASC" : "DESC";
    }

    const [results, total] = await Promise.all([
      this.customerUserWishlistRepo
        .createQueryBuilder("customerUserWishlist")
        .leftJoinAndSelect("customerUserWishlist.customerUser", "customerUser")
        .leftJoinAndSelect("customerUserWishlist.product", "product")
        .leftJoinAndSelect("product.category", "category")
        .leftJoinAndSelect("product.productImages", "productImages")
        .leftJoinAndSelect("productImages.file", "file")
        .where('"customerUser"."CustomerUserId" = :customerUserId', {
          customerUserId,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where(`product."Name" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            })
              .orWhere(`product."ShortDesc" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`product."LongDesc" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`category."Name" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`category."Desc" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              });
          })
        )
        .orderBy(field, direction)
        .skip(skip)
        .take(take)
        .getMany(),

      this.customerUserWishlistRepo
        .createQueryBuilder("customerUserWishlist")
        .leftJoinAndSelect("customerUserWishlist.customerUser", "customerUser")
        .leftJoin("customerUserWishlist.product", "product")
        .leftJoin("product.category", "category")
        .where('"customerUser"."CustomerUserId" = :customerUserId', {
          customerUserId,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where(`product."Name" ILIKE :keywords`, {
              keywords: `%${keywords}%`,
            })
              .orWhere(`product."ShortDesc" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`product."LongDesc" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`category."Name" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              })
              .orWhere(`category."Desc" ILIKE :keywords`, {
                keywords: `%${keywords}%`,
              });
          })
        )
        .getCount(),
    ]);

    return { results, total };
  }

  async getById(customerUserWishlistId) {
    const result = await this.customerUserWishlistRepo.findOne({
      where: {
        customerUserWishlistId,
      },
      relations: {
        customerUser: true,
        product: {
          thumbnailFile: true,
          category: true,
        },
      },
    });
    if (!result) {
      throw Error(CUSTOMERUSERWISHLIST_ERROR_NOT_FOUND);
    }
    return result;
  }

  async getBySKU(customerUserId, sku) {
    const result = await this.customerUserWishlistRepo.findOne({
      where: {
        product: {
          sku,
        },
        customerUser: {
          customerUserId,
        },
      },
      relations: {
        product: {
          category: true,
        },
      },
    });
    return result;
  }

  async create(dto: CreateCustomerUserWishlistDto) {
    return await this.customerUserWishlistRepo.manager.transaction(
      async (entityManager) => {
        try {
          let customerUserWishlist = new CustomerUserWishlist();
          customerUserWishlist.dateTime = await getDate();

          const customer = await entityManager.findOne(CustomerUser, {
            where: {
              customerUserId: dto.customerUserId,
            },
          });
          if (!customer) {
            throw Error(CUSTOMER_USER_ERROR_USER_NOT_FOUND);
          }
          customerUserWishlist.customerUser = customer;

          const product = await entityManager.findOne(Product, {
            where: {
              productId: dto.productId,
            },
          });
          if (!product) {
            throw Error(PRODUCT_ERROR_NOT_FOUND);
          }
          customerUserWishlist.product = product;

          customerUserWishlist = await entityManager.save(
            CustomerUserWishlist,
            customerUserWishlist
          );

          const interested = Number(product.interested ?? 0) + 1;
          product.interested = interested.toString();
          await entityManager.save(Product, product);
          return await entityManager.findOne(CustomerUserWishlist, {
            where: {
              customerUserWishlistId:
                customerUserWishlist?.customerUserWishlistId,
            },
            relations: {
              customerUser: true,
              product: {
                thumbnailFile: true,
                category: true,
              },
            },
          });
        } catch (ex) {
          if (ex.message && ex.message.includes("duplicate")) {
            throw Error(CUSTOMERUSERWISHLIST_ERROR_DUPLICATE);
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async delete(customerUserWishlistId) {
    const customerUserWishlist = await this.customerUserWishlistRepo.findOne({
      where: {
        customerUserWishlistId,
      },
      relations: {
        customerUser: true,
        product: {
          category: true,
        },
      },
    });
    if (!customerUserWishlist) {
      throw Error(CUSTOMERUSERWISHLIST_ERROR_NOT_FOUND);
    }
    await this.customerUserWishlistRepo.delete(customerUserWishlistId);
    const interested = Number(customerUserWishlist.product.interested ?? 0) - 1;
    customerUserWishlist.product.interested = (
      interested <= 0 ? 0 : interested
    ).toString();
    await this.customerUserWishlistRepo.manager.save(
      Product,
      customerUserWishlist.product
    );
    return customerUserWishlist;
  }
}
