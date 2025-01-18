import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class createdSkill {
  @ApiProperty({ description: 'Skill title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Skill category' })
  @IsNumber({}, { each: true })
  category: number;
}

export class updateSkill {
  @ApiPropertyOptional({ description: 'Skill title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Skill category (optional)' })
  @IsOptional()
  @IsNumber()
  category?: number; // Поле теперь необязательное
}
