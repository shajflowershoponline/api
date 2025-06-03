import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class DefaultCustomerUserWishlistDto {
  @ApiProperty()
  @IsNotEmpty()
  customerUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  productId: string;
}
