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
  IsDefined,
} from "class-validator";
import { DefaultCustomerUserDto } from "./customer-user-base.dto";
import { CoordinatesDto } from "../map/map.dto";

export class UpdateCustomerUserDto extends DefaultCustomerUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  accessCode: string;
}

export class UpdateCustomerUserProfileDto extends DefaultCustomerUserDto {
  @ApiProperty()
  @IsOptional()
  userProfilePic: any;

  @ApiProperty()
  @IsOptional()
  mobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsOptional()
  addressLandmark: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  addressCoordinates: CoordinatesDto;
}
