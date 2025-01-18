import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { SkillService } from './skill.service';
import { createdSkill } from './skill.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
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
}
