import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DefaultCategoryDto } from "./category-base.dto";

export class CreateCategoryDto extends DefaultCategoryDto {
}