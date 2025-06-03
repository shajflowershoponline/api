import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsBooleanString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUppercase,
  Validate,
  ValidateNested,
} from "class-validator";
import { IsNonNegativeConstraint } from "../non-negative.dto";

export class DefaultDiscountDto {
  @ApiProperty()
  @IsNotEmpty()
  promoCode: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    default: "",
  })
  @IsNotEmpty()
  @IsIn(["AMOUNT", "PERCENTAGE"])
  @IsUppercase()
  type: "AMOUNT" | "PERCENTAGE";

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  value: string;

  @ApiProperty()
  @IsOptional()
  thumbnailFile: any;
}
