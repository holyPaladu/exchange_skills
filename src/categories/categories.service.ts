import {
  ConflictException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { createCategoryDto } from './dto/categoty.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  @HttpCode(HttpStatus.OK)
  async findAll() {
    const category = await this.categoryRepository.find();
    if (!category) throw new NotFoundException('Categories null');
    return {
      categories: category,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  async createCategory(data: createCategoryDto) {
    const { name } = data;
    const existCategory = await this.categoryRepository.findOneBy({ name });
    if (existCategory) {
      throw new ConflictException('Category already exists');
    }
    const category = this.categoryRepository.create(data);
    await this.categoryRepository.save(category);

    return {
      status: HttpStatus.CREATED,
      message: 'Category successfully created',
    };
  }

  @HttpCode(HttpStatus.OK)
  async deleteCategory(id: number) {
    await this.categoryRepository.delete(id);
    return {
      status: HttpStatus.OK,
      message: 'Category success deleted',
    };
  }

  @HttpCode(HttpStatus.OK)
  async updateCategory(id: number, data: createCategoryDto) {
    await this.categoryRepository.update(id, data);
    return this.categoryRepository.findOneBy({ id });
  }
}
