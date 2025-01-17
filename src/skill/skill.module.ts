import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { Skill } from './entity/skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  providers: [SkillService],
  controllers: [SkillController],
})
export class SkillModule {}
