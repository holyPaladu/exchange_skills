import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { createdCategory } from './category.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Created category' })
  @ApiBody({ type: createdCategory }) // Defines the request body
  @ApiResponse({ status: 201, description: 'Successful created category' })
  async created(@Body() body: createdCategory) {
    return this.categoryService.createdCategory(body);
  }

  @Get()
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Show all category' })
  @ApiResponse({ status: 200, description: 'Successful output categories' })
  async findAll() {
    return this.categoryService.findAllCategory();
  }

  @Put(':id')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Show all category' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the category to update',
  })
  @ApiBody({ type: createdCategory })
  @ApiResponse({ status: 200, description: 'Successful updated category' })
  async updateTitle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: createdCategory,
  ) {
    return this.categoryService.updateCategory(id, body);
  }

  @Delete(':id')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the category to delete',
  })
  @ApiResponse({ status: 200, description: 'Successful deleted category' })
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategoryById(id);
  }

  @Post(':id')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Restore category by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the category to restore',
  })
  @ApiResponse({ status: 200, description: 'Successful restore category' })
  async restoreByTd(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.restoreCategoryById(id);
  }
}
