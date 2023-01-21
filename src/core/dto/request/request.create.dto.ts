import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
import * as moment from "moment";

export class CreateRequestDto {
  @ApiProperty({
    type: Date,
    default: moment().format("YYYY-MM-DD"),
  })
  @IsDateString()
  @Type(() => Date)
  @Transform((value) => moment(new Date(value.value)).format("YYYY-MM-DD"))
  @IsNotEmpty()
  referenceDate: Date;
  
  @ApiProperty()
  @IsNotEmpty()
  requestersFullName: string;
  
  @ApiProperty()
  @IsOptional()
  husbandFullName: string;
  
  @ApiProperty()
  @IsOptional()
  wifeFullName: string;

  @ApiProperty()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  requestTypeId: string;

  @ApiProperty()
  @IsOptional()
  remarks: string;
}
