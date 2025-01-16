import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import {
  createSkillDto,
  CreateUserSkillDto,
  updateSkillDto,
} from './dto/skill.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Skill } from './entity/skill.entity';

@Controller('skills')
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly userSkillsService: SkillsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Output all skills' })
  async findAll() {
    return this.skillsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiBody({ type: createSkillDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Skill successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category not found or skill already exists in this category',
  })
  async createSkill(@Body() createSkillDto: createSkillDto) {
    return this.skillsService.createSkill(createSkillDto);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiOperation({ summary: 'Update skill name by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Skill ID' })
  @ApiBody({ type: updateSkillDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category successfully updated',
    type: Skill, // The return type can be your entity
  })
  async updateSkill(
    @Param('id') id: number,
    @Body() updateSkillDto: updateSkillDto,
  ) {
    return this.skillsService.updateSkill(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiOperation({ summary: 'Delete a skill by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Skill ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill successfully deleted',
  })
  async deleteSkill(@Param('id') id: number) {
    return this.skillsService.deleteSkill(id);
  }

  @Post('user')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiOperation({ summary: 'Create user-skill relationships' })
  @ApiBody({ type: CreateUserSkillDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User skills successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'User or skills not found, or user already has one of these skills',
  })
  async createUserSkills(@Body() createUserSkillDto: CreateUserSkillDto) {
    return this.userSkillsService.createUserSkills(createUserSkillDto);
  }
}
