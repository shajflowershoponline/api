import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from "class-validator";
import { CoordinatesDto } from "../map/map.dto";

export enum UpdateStatusEnums {
  DELIVERY = "DELIVERY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: UpdateStatusEnums,
    description: "Status of the order",
    example: UpdateStatusEnums.DELIVERY,
  })
  @IsEnum(UpdateStatusEnums)
  status: UpdateStatusEnums;
}
