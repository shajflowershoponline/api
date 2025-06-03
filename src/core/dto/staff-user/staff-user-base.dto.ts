import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUppercase,
  ValidateNested,
} from "class-validator";
import moment from "moment";

export class StaffUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}

export class DefaultStaffUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, name is required!"
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Not allowed, username is required!"
  })
  userName: string;
}

export class UpdateProfilePictureDto {
  @ApiProperty()
  @IsOptional()
  userProfilePic: any;
}