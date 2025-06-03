import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { DefaultCollectionDto } from "./collection-base.dto";

export class UpdateCollectionDto extends DefaultCollectionDto {}