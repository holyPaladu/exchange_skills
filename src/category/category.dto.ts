import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createdCategory {
  @ApiProperty({ description: 'Category title' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
