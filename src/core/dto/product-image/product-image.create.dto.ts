import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DefaultProductImageDto } from "./product-image-base.dto";

export class CreateProductImageDto extends DefaultProductImageDto {
}
