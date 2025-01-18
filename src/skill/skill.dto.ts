import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createdSkill {
  @ApiProperty({ description: 'Skill title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'List of category IDs',
    type: [Number],
  })
  @ApiProperty({ description: 'User skill' })
  @IsArray()
  @IsNumber({}, { each: true })
  category: number;
}
