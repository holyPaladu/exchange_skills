import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { Skill } from './entity/skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, Category])],
  providers: [SkillService],
  controllers: [SkillController],
})
export class SkillModule {}
