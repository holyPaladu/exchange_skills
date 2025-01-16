import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill, UserSkills } from './entity/skill.entity';
import { Category } from 'src/categories/entity/category.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, Category, User, UserSkills])],
  providers: [SkillsService],
  controllers: [SkillsController],
})
export class SkillsModule {}
