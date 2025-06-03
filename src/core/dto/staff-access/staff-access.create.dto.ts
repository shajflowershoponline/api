import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DefaultStaffAccessDto } from "./staff-access-base.dto";

export class CreateStaffAccessDto extends DefaultStaffAccessDto {
}