import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
  IsBooleanString,
  IsDateString,
  IsEmail,
  IsIn,
  IsOptional,
  IsUppercase,
  Matches,
} from "class-validator";
import { DefaultStaffUserDto } from "./staff-user-base.dto";

export class UpdateStaffUserDto extends DefaultStaffUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  staffAccessCode: string;
}

export class UpdateStaffUserProfileDto extends DefaultStaffUserDto {
  @ApiProperty()
  @IsOptional()
  userProfilePic: any;
}