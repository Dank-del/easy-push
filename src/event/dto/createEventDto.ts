import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export default class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  identifier: string;
  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  payload: string | any;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  channel_id: number;
}
