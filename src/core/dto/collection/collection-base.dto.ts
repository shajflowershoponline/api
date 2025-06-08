import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsDate,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Validate,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { IsNonNegativeConstraint } from "../non-negative.dto";

export class DefaultCollectionDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  desc: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Validate(IsNonNegativeConstraint) // Custom validation applied here
  sequenceId: string;

  @ApiProperty()
  @IsOptional()
  thumbnailFile: any;

  @ApiProperty({
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isSale = false;

  @ApiProperty()
  @ValidateIf((o) => o.isSale === true) // only validate if isSale is true
  @Type(() => Date)
  @IsDate({ message: "Sale from must be a valid date" })
  saleFromDate: Date;

  @ApiProperty()
  @ValidateIf((o) => o.isSale === true) // only validate if isSale is true
  @Type(() => Date)
  @IsDate({ message: "Sale due must be a valid date" })
  saleDueDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  productIds: string[] = [];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  discountTagsIds: string[] = [];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isFeatured = false;
}
