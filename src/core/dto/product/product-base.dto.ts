import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Validate,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { IsNonNegativeConstraint } from "../non-negative.dto";

export class ProductImageDto {
  @ApiProperty()
  @IsOptional()
  guid: string;

  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @ValidateIf((o) => {
    return o.noChanges === true || o.noChanges.toString() === "true";
  })
  base64: string;

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @IsOptional()
  noChanges = false;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Validate(IsNonNegativeConstraint) // Custom validation applied here
  sequenceId: string;
}
export class DefaultProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  shortDesc: string;

  @ApiProperty()
  @IsNotEmpty()
  longDesc: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @ApiProperty()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: "Size value, must be 1, 2, or 3",
    enum: [1, 2, 3],
    example: 1,
  })
  @IsNotEmpty()
  @IsIn([1, 2, 3], {
    message: "Size must be one of the following values: 1, 2, or 3",
  })
  size: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  updateImage = false;

  @ApiProperty({
    isArray: true,
    type: ProductImageDto,
  })
  @IsOptional()
  @IsArray()
  @Type(() => ProductImageDto)
  @ValidateNested()
  productImages: ProductImageDto[] = [];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  giftAddOnsAvailable: string[] = [];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  discountTagsIds: string[] = [];
}
