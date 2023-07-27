import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class createChannelDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  appId: number;
}
