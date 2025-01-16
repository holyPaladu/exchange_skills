import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createSkillDto {
  @ApiProperty({ description: 'Skill name', example: 'JavaScript' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Category ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}

export class updateSkillDto {
  @ApiProperty({ description: 'Skill name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateUserSkillDto {
  @ApiProperty({ description: 'User ID' })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'List of Skill IDs',
    type: [Number],
  })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  skillIds: number[] | string;
}
