import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { DefaultProductCollectionDto } from "./product-collection-base.dto";

export class UpdateProductCollectionDto extends DefaultProductCollectionDto {}
