import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Skill } from 'src/skill/entity/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Skill])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
