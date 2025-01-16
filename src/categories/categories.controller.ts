import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { createCategoryDto } from './dto/categoty.dto';
import { Category } from './entity/categoty.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Output all category' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: createCategoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category already exists',
  })
  async createCategory(@Body() bd: createCategoryDto) {
    return this.categoriesService.createCategory(bd);
  }

  @Delete(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Category ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category successfully deleted',
  })
  async deleteCategory(@Param('id') id: number) {
    return this.categoriesService.deleteCategory(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiOperation({ summary: 'Update category name by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Category ID' })
  @ApiBody({ type: createCategoryDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category successfully updated',
    type: Category, // The return type can be your entity
  })
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: createCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }
}
