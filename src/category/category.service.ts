import {
  ConflictException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { createdCategory } from './category.dto';
import { Skill } from 'src/skill/entity/skill.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createdCategory({ title }: createdCategory) {
    const category = await this.categoryRepository.findOneBy({ title });
    if (category) throw new ConflictException('That category already exist');
    const created = this.categoryRepository.create({ title, skills: [] });
    await this.categoryRepository.save(created);
    return {
      status: HttpStatus.CREATED,
      message: 'Category successfull created',
      category: created,
    };
  }

  @HttpCode(HttpStatus.OK)
  async findAllCategory() {
    return this.categoryRepository.find({ relations: ['skills'] });
  }

  @HttpCode(HttpStatus.OK)
  async updateCategory(id: number, updateData: createdCategory) {
    // Проверка существования категории
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.update(id, { title: updateData.title });
    const updatedCategory = await this.categoryRepository.findOneBy({ id });

    return {
      status: HttpStatus.OK,
      message: `Update category by id:${id}`,
      updatedData: updatedCategory,
    };
  }

  @HttpCode(HttpStatus.OK)
  async deleteCategoryById(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['skills'], // Загружаем связанные навыки
    });

    if (!category) throw new NotFoundException('Category not found');

    // Устанавливаем поле category у всех связанных навыков в null
    if (category.skills.length > 0) {
      await Promise.all(
        category.skills.map((skill) =>
          this.skillRepository.update(skill.id, { category: null }),
        ),
      );
    }

    // Мягко удаляем категорию
    await this.categoryRepository.softDelete(id);

    return {
      status: HttpStatus.OK,
      message: `${category.title} successfully deleted`,
    };
  }

  @HttpCode(HttpStatus.OK)
  async restoreCategoryById(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      withDeleted: true, // Учитываем мягко удалённые категории
    });

    if (!category) throw new NotFoundException('Category not found');

    // Восстанавливаем категорию
    await this.categoryRepository.restore(id);

    // Возвращаем категорию всем навыкам, у которых categoryId == null
    const orphanSkills = await this.skillRepository.find({
      where: { category: null },
    });

    await Promise.all(
      orphanSkills.map((skill) =>
        this.skillRepository.update(skill.id, { category }),
      ),
    );

    return {
      status: HttpStatus.OK,
      message: `${category.title} successfully restored`,
    };
  }
}
