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
import { SkillService } from './skill.service';
import { createdSkill, updateSkill } from './skill.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('skill')
export class SkillController {
  constructor(private skillService: SkillService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Created skill' })
  @ApiBody({ type: createdSkill })
  @ApiResponse({ status: 201, description: 'Successful created skill' })
  async(@Body() bd: createdSkill) {
    return this.skillService.createdSkill(bd);
  }

  @Get()
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Show all skill' })
  @ApiResponse({ status: 200, description: 'Successful output skills' })
  async findAll() {
    return this.skillService.findAllSkills();
  }

  @Put(':id')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update skill' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the skill to update',
  })
  @ApiBody({ type: updateSkill })
  @ApiResponse({ status: 200, description: 'Successful updated category' })
  async updateTitle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: updateSkill,
  ) {
    return this.skillService.updateSkillById(id, body);
  }

  @Delete(':id')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Delete skill by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the skill to delete',
  })
  @ApiResponse({ status: 200, description: 'Successful deleted skill' })
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.skillService.deleteById(id);
  }

  @Post('restore/:id')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Restore skill by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the skill to restore',
  })
  @ApiResponse({ status: 200, description: 'Successful restore skill' })
  async restoreByTd(@Param('id', ParseIntPipe) id: number) {
    return this.skillService.restoreById(id);
  }
}
