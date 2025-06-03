import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { extname } from "path";
import { LOGIN_ERROR_PASSWORD_INCORRECT } from "src/common/constant/auth-error.constant";
import { STAFF_ACCESS_ERROR_NOT_FOUND } from "src/common/constant/staff-access.constant";
import {
  columnDefToTypeORMCondition,
  hash,
  generateIndentityCode,
  compare,
} from "src/common/utils/utils";
import {
  ProfileResetPasswordDto,
  UpdateUserPasswordDto,
} from "src/core/dto/auth/reset-password.dto";
import { UpdateProfilePictureDto } from "src/core/dto/staff-user/staff-user-base.dto";
import { CreateStaffUserDto } from "src/core/dto/staff-user/staff-user.create.dto";
import {
  UpdateStaffUserDto,
  UpdateStaffUserProfileDto,
} from "src/core/dto/staff-user/staff-user.update.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { StaffAccess } from "src/db/entities/StaffAccess";
import { StaffUser } from "src/db/entities/StaffUser";
import { Repository, In } from "typeorm";
import {
  STAFF_USER_ERROR_USER_DUPLICATE,
  STAFF_USER_ERROR_USER_NOT_FOUND,
} from "src/common/constant/staff-user-error.constant";

@Injectable()
export class StaffUserService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(StaffUser)
    private readonly staffUserRepo: Repository<StaffUser>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);
    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.staffUserRepo.find({
        where: {
          ...condition,
          active: true,
        },
        relations: {},
        skip,
        take,
        order,
      }),
      this.staffUserRepo.count({
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

  async getByCode(staffUserCode) {
    const res = await this.staffUserRepo.findOne({
      where: {
        staffUserCode,
        active: true,
      },
      relations: {
        staffAccess: true,
      },
    });

    if (!res) {
      throw Error(STAFF_USER_ERROR_USER_NOT_FOUND);
    }
    if (res.password) delete res.password;
    return res;
  }

  async create(dto: CreateStaffUserDto) {
    return await this.staffUserRepo.manager.transaction(
      async (entityManager) => {
        try {
          let staffUser = new StaffUser();
          staffUser.userName = dto.userName;
          staffUser.password = await hash(dto.password);

          staffUser.name = dto.name ?? "";
          if (dto.staffAccessCode) {
            const access = await entityManager.findOne(StaffAccess, {
              where: {
                staffAccessCode: dto.staffAccessCode,
                active: true,
              },
            });

            if (!access) {
              throw Error(STAFF_ACCESS_ERROR_NOT_FOUND);
            }
            staffUser.staffAccess = access;
          }
          staffUser.accessGranted = true;
          staffUser = await entityManager.save(StaffUser, staffUser);
          staffUser.staffUserCode = generateIndentityCode(
            staffUser.staffUserId
          );
          staffUser = await entityManager.save(StaffUser, staffUser);
          staffUser = await entityManager.findOne(StaffUser, {
            where: {
              staffUserCode: staffUser.staffUserCode,
              active: true,
            },
            relations: {},
          });
          delete staffUser.password;
          return staffUser;
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw new HttpException(
              STAFF_USER_ERROR_USER_DUPLICATE,
              HttpStatus.BAD_REQUEST
            );
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async updateProfile(staffUserCode, dto: UpdateStaffUserProfileDto) {
    return await this.staffUserRepo.manager.transaction(
      async (entityManager) => {
        let staffUser = await entityManager.findOne(StaffUser, {
          where: {
            staffUserCode,
            active: true,
          },
          relations: {},
        });

        if (!staffUser) {
          throw Error(STAFF_USER_ERROR_USER_NOT_FOUND);
        }

        staffUser.accessGranted = true;
        staffUser.name = dto.name ?? "";
        staffUser = await entityManager.save(StaffUser, staffUser);

        staffUser = await entityManager.findOne(StaffUser, {
          where: {
            staffUserCode,
            active: true,
          },
          relations: {},
        });
        delete staffUser.password;
        return staffUser;
      }
    );
  }

  async update(staffUserCode, dto: UpdateStaffUserDto) {
    return await this.staffUserRepo.manager.transaction(
      async (entityManager) => {
        try {
          let staffUser = await entityManager.findOne(StaffUser, {
            where: {
              staffUserCode,
              active: true,
            },
            relations: {},
          });

          if (!staffUser) {
            throw Error(STAFF_USER_ERROR_USER_NOT_FOUND);
          }

          staffUser.name = dto.name;
          if (dto.staffAccessCode) {
            const staffAccess = await entityManager.findOne(StaffAccess, {
              where: {
                staffAccessCode: dto.staffAccessCode,
                active: true,
              },
            });

            if (!staffAccess) {
              throw Error(STAFF_ACCESS_ERROR_NOT_FOUND);
            }
            staffUser.staffAccess = staffAccess;
          }
          staffUser.accessGranted = true;
          staffUser = await entityManager.save(StaffUser, staffUser);
          staffUser = await entityManager.findOne(StaffUser, {
            where: {
              staffUserCode,
              active: true,
            },
            relations: {},
          });
          delete staffUser.password;
          return staffUser;
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw new HttpException(
              STAFF_USER_ERROR_USER_DUPLICATE,
              HttpStatus.BAD_REQUEST
            );
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async delete(staffUserCode) {
    return await this.staffUserRepo.manager.transaction(
      async (entityManager) => {
        let staffUser = await entityManager.findOne(StaffUser, {
          where: {
            staffUserCode,
            active: true,
          },
          relations: {},
        });

        if (!staffUser) {
          throw Error(STAFF_USER_ERROR_USER_NOT_FOUND);
        }

        staffUser.active = false;
        staffUser = await entityManager.save(StaffUser, staffUser);
        delete staffUser.password;
        return staffUser;
      }
    );
  }
}
