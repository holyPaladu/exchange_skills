import {
  ConflictException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Skill } from './entity/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createdSkill } from './skill.dto';
import { Category } from 'src/category/entity/category.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createdSkill({ title, category }: createdSkill) {
    const findedSkill = await this.skillRepository.findOneBy({ title });
    if (findedSkill)
      throw new ConflictException('Skill with that title already exist');
    const categoryEntity = await this.categoryRepository.findOne({
      where: { id: category }, // Предполагается, что `category` — это ID
    });
    if (!categoryEntity) {
      throw new NotFoundException('Category not found');
    }
    const createdSkill = this.skillRepository.create({
      title,
      category: categoryEntity,
    });
    await this.skillRepository.save(createdSkill);
    return {
      status: HttpStatus.CREATED,
      message: 'Skill successfully created',
    };
  }

  @HttpCode(HttpStatus.OK)
  async findAllSkills() {
    // const finded = await this.skillRepository.find({ relations: ['category'] });
    // return finded.map((skill) => ({
    //   ...skill,
    //   category: skill.category?.id || null,
    // }));
    return this.skillRepository.find({ relations: ['category'] });
  }
}
