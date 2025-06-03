import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Validate,
  ValidateNested,
} from "class-validator";
import { IsNonNegativeConstraint } from "../non-negative.dto";

export class DefaultCategoryDto {
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
}