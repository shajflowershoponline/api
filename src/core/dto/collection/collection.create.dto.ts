import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DefaultCollectionDto } from "./collection-base.dto";

export class CreateCollectionDto extends DefaultCollectionDto {
}
