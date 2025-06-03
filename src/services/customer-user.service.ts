import {
  columnDefToTypeORMCondition,
  compare,
  generateIndentityCode,
  getFullName,
  hash,
} from "../common/utils/utils";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { extname } from "path";
import { LOGIN_ERROR_PASSWORD_INCORRECT } from "src/common/constant/auth-error.constant";
import { CUSTOMER_USER_ERROR_USER_DUPLICATE, CUSTOMER_USER_ERROR_USER_NOT_FOUND } from "src/common/constant/customer-user-error.constant";
import {
  ProfileResetPasswordDto,
  UpdateUserPasswordDto,
} from "src/core/dto/auth/reset-password.dto";
import { CreateCustomerUserDto } from "src/core/dto/customer-user/customer-user.create.dto";
import {
  UpdateCustomerUserDto,
  UpdateCustomerUserProfileDto,
} from "src/core/dto/customer-user/customer-user.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { In, Repository } from "typeorm";
import { v4 as uuid } from "uuid";

@Injectable()
export class CustomerUserService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(CustomerUser)
    private readonly customerUserRepo: Repository<CustomerUser>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);
    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.customerUserRepo.find({
        where: {
          ...condition,
          active: true,
        },
        relations: {},
        skip,
        take,
        order,
      }),
      this.customerUserRepo.count({
        where: {
          ...condition,
          active: true,
        },
      }),
    ]);
    return {
      results: results.map((x) => {
        delete x.password;
        return x;
      }),
      total,
    };
  }

  async getByCode(customerUserCode) {
    const res = await this.customerUserRepo.findOne({
      where: {
        customerUserCode,
        active: true,
      },
      relations: {},
    });

    if (!res) {
      throw Error(CUSTOMER_USER_ERROR_USER_NOT_FOUND);
    }
    if (res.password) delete res.password;
    return res;
  }

  async create(dto: CreateCustomerUserDto) {
    return await this.customerUserRepo.manager.transaction(
      async (entityManager) => {
        try {
          let customerUser = new CustomerUser();
          customerUser.email = dto.email;
          customerUser.password = await hash(dto.password);

          customerUser.name = dto.name ?? "";
          customerUser.email = dto.email;
          customerUser.currentOtp = "0";
          customerUser.isVerifiedUser = true;
          customerUser = await entityManager.save(CustomerUser, customerUser);
          customerUser.customerUserCode = generateIndentityCode(
            customerUser.customerUserId
          );
          customerUser = await entityManager.save(CustomerUser, customerUser);
          customerUser = await entityManager.findOne(CustomerUser, {
            where: {
              customerUserCode: customerUser.customerUserCode,
              active: true,
            },
            relations: {},
          });
          delete customerUser.password;
          return customerUser;
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw new HttpException(
              CUSTOMER_USER_ERROR_USER_DUPLICATE,
              HttpStatus.BAD_REQUEST
            );
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async updateProfile(customerUserCode, dto: UpdateCustomerUserProfileDto) {
    return await this.customerUserRepo.manager.transaction(
      async (entityManager) => {
        let customerUser = await entityManager.findOne(CustomerUser, {
          where: {
            customerUserCode,
            active: true,
          },
          relations: {},
        });

        if (!customerUser) {
          throw Error(CUSTOMER_USER_ERROR_USER_NOT_FOUND);
        }

        customerUser.name = dto.name ?? "";
        customerUser.email = dto.email;
        customerUser.mobileNumber = dto.mobileNumber;
        customerUser.address = dto.address;
        customerUser.addressLandmark = dto.addressLandmark;
        customerUser.addressCoordinates = dto.addressCoordinates;
        customerUser = await entityManager.save(CustomerUser, customerUser);

        customerUser = await entityManager.findOne(CustomerUser, {
          where: {
            customerUserCode,
            active: true,
          },
          relations: {},
        });
        delete customerUser.password;
        return customerUser;
      }
    );
  }

  async update(customerUserCode, dto: UpdateCustomerUserDto) {
    return await this.customerUserRepo.manager.transaction(
      async (entityManager) => {
        try {
          let customerUser = await entityManager.findOne(CustomerUser, {
            where: {
              customerUserCode,
              active: true,
            },
            relations: {},
          });

          if (!customerUser) {
            throw Error(CUSTOMER_USER_ERROR_USER_NOT_FOUND);
          }

          customerUser.name = dto.name;
          customerUser.email = dto.email;
          customerUser = await entityManager.save(CustomerUser, customerUser);
          customerUser = await entityManager.findOne(CustomerUser, {
            where: {
              customerUserCode,
              active: true,
            },
            relations: {},
          });
          delete customerUser.password;
          return customerUser;
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw new HttpException(
              CUSTOMER_USER_ERROR_USER_DUPLICATE,
              HttpStatus.BAD_REQUEST
            );
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async delete(customerUserCode) {
    return await this.customerUserRepo.manager.transaction(
      async (entityManager) => {
        let customerUser = await entityManager.findOne(CustomerUser, {
          where: {
            customerUserCode,
            active: true,
          },
          relations: {},
        });

        if (!customerUser) {
          throw Error(CUSTOMER_USER_ERROR_USER_NOT_FOUND);
        }

        customerUser.active = false;
        customerUser = await entityManager.save(CustomerUser, customerUser);
        delete customerUser.password;
        return customerUser;
      }
    );
  }
}
