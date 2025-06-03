
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as fs from "fs";
import * as path from "path";
import {
  compare,
  generateIndentityCode,
  generateOTP,
  getFullName,
  hash,
} from "src/common/utils/utils";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, In, Repository } from "typeorm";
import moment from "moment";
import { LOGIN_ERROR_PASSWORD_INCORRECT, LOGIN_ERROR_PENDING_ACCESS_REQUEST, LOGIN_ERROR_USER_NOT_FOUND } from "src/common/constant/auth-error.constant";
import { RegisterCustomerUserDto } from "src/core/dto/auth/register.dto";
import { ConfigService } from "@nestjs/config";
import { VerifyCustomerUserDto } from "src/core/dto/auth/verify.dto";
import { EmailService } from "./email.service";
import { CustomerUser } from "src/db/entities/CustomerUser";
import { StaffUser } from "src/db/entities/StaffUser";
import { CustomerUserResetPasswordDto, CustomerUserResetPasswordSubmitDto, CustomerUserResetVerifyDto } from "src/core/dto/auth/reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerUser) private readonly customerUserRepo: Repository<CustomerUser>,
    @InjectRepository(StaffUser) private readonly staffUserRepo: Repository<StaffUser>,
    private emailService: EmailService
  ) {}

  async registerCustomer(dto: RegisterCustomerUserDto) {
    try {
      return await this.customerUserRepo.manager.transaction(
        async (transactionalEntityManager) => {
          let customerUser = await transactionalEntityManager.findOneBy(CustomerUser, {
            email: dto.email
          });

          if(!customerUser) {
            customerUser = new CustomerUser();
          }
          else if(customerUser && customerUser.isVerifiedUser) {
            throw Error("Email already used!");
          }
          customerUser.email = dto.email;
          customerUser.password = await hash(dto.password);
          customerUser.name = dto.name;
          customerUser.email = dto.email;
          customerUser.currentOtp = generateOTP();
          customerUser = await transactionalEntityManager.save(CustomerUser, customerUser);
          const sendEmailResult = await this.emailService.sendEmailVerification(dto.email, customerUser.customerUserCode, customerUser.currentOtp);
          if(!sendEmailResult) {
            throw new Error("Error sending email verification!");
          }

          customerUser.customerUserCode = generateIndentityCode(customerUser.customerUserId);
          customerUser = await transactionalEntityManager.save(CustomerUser, customerUser);
          delete customerUser.password;
          return customerUser;
        }
      );
    } catch (ex) {
      if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_username")
      ) {
        throw Error("Email already used!");
      } else {
        throw ex;
      }
    }
  }

  async registerVerifyCustomer(dto: VerifyCustomerUserDto) {
    try {
      return await this.customerUserRepo.manager.transaction(
        async (transactionalEntityManager) => {
          let customerUser = await transactionalEntityManager.findOneBy(CustomerUser, {
            email: dto.email,
          });

          if(!customerUser) {
            throw Error("Email not found!");
          }
          else if(customerUser && customerUser.isVerifiedUser) {
            throw Error("Email already verified!");
          } else if(customerUser && customerUser.currentOtp.toString().trim() !== dto.otp.toString().trim()) {
            throw Error("Invalid code!");
          }
          customerUser.isVerifiedUser = true;
          customerUser = await transactionalEntityManager.save(CustomerUser, customerUser);
          delete customerUser.password;
          return customerUser;
        }
      );
    } catch (ex) {
      throw ex;
    }
  }

  async getStaffByCredentials({userName, password }) {
    try {
      let staffUser = await this.staffUserRepo.findOne({
        where: {
          userName,
          active: true,
        },
        relations: {
          staffAccess: true
        }
      });
      if (!staffUser) {
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(staffUser.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      if (!staffUser.accessGranted) {
        throw Error(LOGIN_ERROR_PENDING_ACCESS_REQUEST);
      }
      delete staffUser.password;
      return staffUser;
    } catch(ex) {
      throw ex;
    }
  }
  
  async getCustomerByCredentials({email, password }) {
    try {
      let customerUser = await this.customerUserRepo.findOne({
        where: {
          email,
          active: true
        },
        relations: {
        }
      });
      if (!customerUser) {
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(customerUser.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      delete customerUser.password;
      return customerUser;
    } catch(ex) {
      throw ex;
    }
  }

  async verifyCustomerUser(customerUserCode, hash) {
    try {
      return await this.customerUserRepo.manager.transaction(async (entityManager) => {
        let customerUser = await entityManager.findOne(CustomerUser, {
          where: {
            customerUserCode
          }
        });
        if(!customerUser) {
          throw Error("Invalid user code");
        }
        if(customerUser.isVerifiedUser) {
          throw Error("User was already verified!");
        }
        const match = await compare(hash, customerUser.currentOtp);
        if (!match) {
          throw Error("Invalid code");
        }
        customerUser.isVerifiedUser = true;
        customerUser = await entityManager.save(CustomerUser, customerUser);
        delete customerUser.password;
        return true;
      });
    } catch(ex) {
      throw ex;
    }
  }

  async customerUserResetPasswordSubmit(dto: CustomerUserResetPasswordSubmitDto) {
    try {
      return await this.customerUserRepo.manager.transaction(async (entityManager) => {
        let customerUser = await entityManager.findOne(CustomerUser, {
          where: {
            email: dto.email
          }
        });
        if(!customerUser) {
          throw Error("Email not found!");
        }
        if(!customerUser.isVerifiedUser) {
          throw Error("User was not yet verified!");
        }
        customerUser.currentOtp = generateOTP();
        customerUser = await entityManager.save(CustomerUser, customerUser);
        const sendEmailResult = await this.emailService.sendResetPasswordOtp(dto.email, customerUser.customerUserCode, customerUser.currentOtp);
        if(!sendEmailResult) {
          throw new Error("Error sending email verification!");
        }
        delete customerUser.password;
        return true;
      });
    } catch(ex) {
      throw ex;
    }
  }

  async customerUserResetPasswordVerify(dto: CustomerUserResetVerifyDto) {
    try {
      return await this.customerUserRepo.manager.transaction(async (entityManager) => {
        let customerUser = await entityManager.findOne(CustomerUser, {
          where: {
            email: dto.email
          }
        });
        if(!customerUser) {
          throw Error("Email not found!");
        }
        if(!customerUser.isVerifiedUser) {
          throw Error("User was not yet verified!");
        }
        const match = customerUser.currentOtp === dto.otp;
        if (!match) {
          throw Error("Invalid code");
        }
        return true;
      });
    } catch(ex) {
      throw ex;
    }
  }

  async customerUserResetPassword(dto: CustomerUserResetPasswordDto) {
    try {
      return await this.customerUserRepo.manager.transaction(async (entityManager) => {
        let customerUser = await entityManager.findOne(CustomerUser, {
          where: {
            email: dto.email
          }
        });
        if(!customerUser) {
          throw Error("Email not found!");
        }
        if(!customerUser.isVerifiedUser) {
          throw Error("User was not yet verified!");
        }
        const match = customerUser.currentOtp === dto.otp;
        if (!match) {
          throw Error("Invalid code");
        }
        customerUser.password = await hash(dto.password);
        customerUser = await entityManager.save(CustomerUser, customerUser);
        delete customerUser.password;
        return customerUser;
      });
    } catch(ex) {
      throw ex;
    }
  }
}
