import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { Skill } from './entity/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createdSkill () {
    
  }
}
