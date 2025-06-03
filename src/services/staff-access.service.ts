import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  STAFF_ACCESS_ERROR_DUPLICATE,
  STAFF_ACCESS_ERROR_NOT_FOUND,
} from "src/common/constant/staff-access.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateStaffAccessDto } from "src/core/dto/staff-access/staff-access.create.dto";
import { UpdateStaffAccessDto } from "src/core/dto/staff-access/staff-access.update.dto";
import { StaffAccess } from "src/db/entities/StaffAccess";
import { Repository } from "typeorm";

@Injectable()
export class StaffAccessService {
  constructor(
    @InjectRepository(StaffAccess)
    private readonly staffAccessRepo: Repository<StaffAccess>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.staffAccessRepo.find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
      }),
      this.staffAccessRepo.count({
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

  async getByCode(staffAccessCode) {
    const result = await this.staffAccessRepo.findOne({
      select: {
        staffAccessId: true,
        staffAccessCode: true,
        name: true,
        accessPages: true,
      } as any,
      where: {
        staffAccessCode,
        active: true,
      },
    });
    if (!result) {
      throw Error(STAFF_ACCESS_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateStaffAccessDto) {
    return await this.staffAccessRepo.manager.transaction(
      async (entityManager) => {
        try {
          let staffAccess = new StaffAccess();
          staffAccess.name = dto.name;
          staffAccess.accessPages = dto.accessPages;
          staffAccess = await entityManager.save(staffAccess);
          staffAccess.staffAccessCode = generateIndentityCode(
            staffAccess.staffAccessId
          );
          return await entityManager.save(StaffAccess, staffAccess);
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw new HttpException(
              STAFF_ACCESS_ERROR_DUPLICATE,
              HttpStatus.BAD_REQUEST
            );
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async update(staffAccessCode, dto: UpdateStaffAccessDto) {
    return await this.staffAccessRepo.manager.transaction(
      async (entityManager) => {
        try {
          const staffAccess = await entityManager.findOne(StaffAccess, {
            where: {
              staffAccessCode,
              active: true,
            },
          });
          if (!staffAccess) {
            throw Error(STAFF_ACCESS_ERROR_NOT_FOUND);
          }
          staffAccess.name = dto.name;
          staffAccess.accessPages = dto.accessPages;
          return await entityManager.save(StaffAccess, staffAccess);
        } catch (ex) {
          if (ex.message.includes("duplicate")) {
            throw new HttpException(
              STAFF_ACCESS_ERROR_DUPLICATE,
              HttpStatus.BAD_REQUEST
            );
          } else {
            throw ex;
          }
        }
      }
    );
  }

  async delete(staffAccessCode) {
    return await this.staffAccessRepo.manager.transaction(
      async (entityManager) => {
        const staffAccess = await entityManager.findOne(StaffAccess, {
          where: {
            staffAccessCode,
            active: true,
          },
        });
        if (!staffAccess) {
          throw Error(STAFF_ACCESS_ERROR_NOT_FOUND);
        }
        staffAccess.active = false;
        return await entityManager.save(StaffAccess, staffAccess);
      }
    );
  }
}
