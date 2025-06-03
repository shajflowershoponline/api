import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DefaultProductDto } from "./product-base.dto";

export class CreateProductDto extends DefaultProductDto {
}