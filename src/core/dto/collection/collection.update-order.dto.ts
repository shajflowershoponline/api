import { IsNotEmpty, IsNumberString, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNonNegativeConstraint } from "../non-negative.dto";

export class UpdateCollectionOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  collectionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Validate(IsNonNegativeConstraint) // Custom validation applied here
  sequenceId: string;
}
