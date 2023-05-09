import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreatePriestDto {
  @ApiProperty()
  @IsNotEmpty()
  priestName: string;

  @ApiProperty({
    isArray: true
  })
  @IsNotEmpty()
  availability: string[] = [""];

}