import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DefaultDiscountDto } from "./discounts-base.dto";

export class CreateDiscountDto extends DefaultDiscountDto {
}