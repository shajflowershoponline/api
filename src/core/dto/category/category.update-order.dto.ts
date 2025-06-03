import { IsNotEmpty, IsNumberString, Validate } from "class-validator";
import { DefaultCategoryDto } from "./category-base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNonNegativeConstraint } from "../non-negative.dto";

export class UpdateCategoryOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Validate(IsNonNegativeConstraint) // Custom validation applied here
  sequenceId: string;
}
