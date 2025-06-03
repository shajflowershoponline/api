import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  Validate,
  ValidateNested,
} from "class-validator";
import { IsNonNegativeConstraint } from "../non-negative.dto";
import { Type } from "class-transformer";

export class UpdateCartItem {
  @ApiProperty()
  @IsNotEmpty()
  cartItemId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsNonNegativeConstraint) // Custom validation applied here
  quantity: string;
}

export class UpdateCartDto {
  @ApiProperty()
  @IsNotEmpty()
  customerUserId: string;

  @ApiProperty({
    type: [UpdateCartItem],
    description: "Array of items to update in the cart",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCartItem)
  items: UpdateCartItem[];
}
