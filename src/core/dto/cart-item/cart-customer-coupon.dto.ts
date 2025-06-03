import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CartCustomerCouponDto {
  @ApiProperty()
  @IsNotEmpty()
  customerUserId: string;

  @ApiProperty()
  @IsOptional()
  promoCode: string;
}
