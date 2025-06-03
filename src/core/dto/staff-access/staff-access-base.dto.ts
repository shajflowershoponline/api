import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from "class-validator";

export class StaffAccessPagesDto {
  @ApiProperty()
  @IsNotEmpty()
  page: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  view = false;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  modify = false;

  @ApiProperty({
    isArray: true,
    type: String
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => String)
  rights: string[] = [];
}

export class DefaultStaffAccessDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    isArray: true,
    type: StaffAccessPagesDto
  })
  @IsOptional()
  @IsArray()
  @Type(() => StaffAccessPagesDto)
  @ValidateNested()
  accessPages: StaffAccessPagesDto[];
}