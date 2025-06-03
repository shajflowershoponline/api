import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DefaultProductCollectionDto } from "./product-collection-base.dto";

export class CreateProductCollectionDto extends DefaultProductCollectionDto {
}
