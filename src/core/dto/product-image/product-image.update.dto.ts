import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { DefaultProductImageDto } from "./product-image-base.dto";

export class UpdateProductImageDto extends DefaultProductImageDto {}
