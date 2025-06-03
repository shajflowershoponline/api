import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DefaultCustomerUserWishlistDto } from "./customer-user-wish-list-base.dto";

export class CreateCustomerUserWishlistDto extends DefaultCustomerUserWishlistDto {
}