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
import { createdSkill, updateSkill } from './skill.dto';
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

  @HttpCode(HttpStatus.OK)
  async updateSkillById(id: number, { title, category }: updateSkill) {
    const skillData = await this.skillRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!skillData) throw new NotFoundException('That skill not finded');

    const updatingData = {
      title: skillData.title,
      category: skillData.category,
    };

    if (title && title.trim().length > 0) updatingData.title = title;

    if (category) {
      const categoryData = await this.categoryRepository.findOneBy({
        id: category,
      });
      if (!categoryData)
        throw new NotFoundException('That category not finded');
      updatingData.category = categoryData;
    }
    await this.skillRepository.update(id, updatingData);
    const alreadyUpdated = await this.skillRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    return {
      status: HttpStatus.OK,
      message: `Successfull updated skill by id ${id}`,
      skill: alreadyUpdated,
    };
  }

  @HttpCode(HttpStatus.OK)
  async deleteById(id: number) {
    const skillData = await this.skillRepository.findOne({
      where: { id },
      relations: ['category', 'category.skills'],
    });
    if (!skillData) throw new NotFoundException('That skill not finded');

    // Если у скилла есть категория, обновляем её, удаляя скилл из массива
    if (skillData.category) {
      const category = skillData.category;
      category.skills = category.skills.filter((skill) => skill.id !== id);
      await this.categoryRepository.save(category); // Сохраняем изменения в категории
    }

    await this.skillRepository.softDelete(id);

    return {
      status: HttpStatus.OK,
      message: `Success deleted skill by id ${id}`,
    };
  }

  @HttpCode(HttpStatus.OK)
  async restoreById(id: number) {
    // Находим скилл по id, загружая связанную категорию
    const skillData = await this.skillRepository.findOne({
      where: { id },
      relations: ['category'],
      withDeleted: true, // Учитываем мягко удалённые категории
    });
    if (!skillData) throw new NotFoundException('That skill not found');

    // Если скилл уже восстановлен, не делаем ничего
    if (!skillData.deletedAt) {
      return {
        status: HttpStatus.OK,
        message: `Skill with id ${id} is already active.`,
      };
    }

    // Восстанавливаем скилл
    await this.skillRepository.restore(id);

    // Если скилл был связан с категорией, добавляем его обратно в массив скиллов категории
    if (skillData.category) {
      const category = skillData.category;
      if (!category.skills.some((skill) => skill.id === id)) {
        category.skills.push(skillData);
        await this.categoryRepository.save(category); // Сохраняем обновлённую категорию
      }
    }
    return {
      status: HttpStatus.OK,
      message: `This skill restored. Id ${id}`,
    };
  }
}
