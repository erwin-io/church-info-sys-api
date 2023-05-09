import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PriestDto {
  @ApiProperty()
  @IsNotEmpty()
  priestId: string;

  @ApiProperty()
  @IsNotEmpty()
  priestName: string;

  @ApiProperty({
    isArray: true
  })
  @IsNotEmpty()
  availability: string[] = [""];
}
