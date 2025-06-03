import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from "class-validator";
import { CoordinatesDto } from "../map/map.dto";

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  customerUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty()
  @IsOptional()
  deliveryAddressLandmark: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  deliveryAddressCoordinates: CoordinatesDto;

  @ApiProperty()
  @IsOptional()
  promoCode: string;

  @ApiProperty()
  @IsOptional()
  specialInstructions: string;

  @ApiProperty()
  @IsOptional()
  notesToRider: string;

  @ApiProperty({
    type: [String],
    description: "List of cart item IDs. Must not be empty.",
    example: ["1", "2"],
  })
  @IsArray()
  @ArrayNotEmpty({ message: "cartItemIds must contain at least one item." })
  @IsString({ each: true, message: "Each cartItemId must be a string." })
  @IsNotEmpty({
    each: true,
    message: "cartItemIds must not contain empty strings.",
  })
  cartItemIds: string[];
}
