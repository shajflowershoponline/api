import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumberString, Validate } from "class-validator";
import { IsNonNegativeConstraint } from "../non-negative.dto";

export class CreateCartItemDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: string;
  
  @ApiProperty()
  @IsNotEmpty()
  customerUserId: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Validate(IsNonNegativeConstraint) // Custom validation applied here
  quantity: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Validate(IsNonNegativeConstraint) // Custom validation applied here
  price: string;
}