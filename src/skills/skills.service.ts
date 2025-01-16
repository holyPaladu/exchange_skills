import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Skill, UserSkills } from './entity/skill.entity';
import { Category } from '../categories/entity/category.entity';
import {
  createSkillDto,
  CreateUserSkillDto,
  updateSkillDto,
} from './dto/skill.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(UserSkills)
    private userSkillsRepository: Repository<UserSkills>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    const skills = await this.skillRepository.find({ relations: ['category'] });
    if (!skills) throw new NotFoundException('Skills null');
    return {
      skills: skills,
    };
  }

  async updateSkill(id: number, data: updateSkillDto) {
    await this.skillRepository.update(id, data);
    return this.skillRepository.findOneBy({ id });
  }

  async deleteSkill(id: number) {
    // Удаление связанных записей из user_skills
    await this.userSkillsRepository.delete({ skill: { id } });
    await this.skillRepository.delete(id);
    return {
      status: HttpStatus.OK,
      message: 'Skill success deleted',
    };
  }

  async createSkill(createSkillDto: createSkillDto) {
    const { name, categoryId } = createSkillDto;
    // Check if the category exists
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new ConflictException('Category not found');
    }
    // Check if the skill already exists
    const existingSkill = await this.skillRepository.findOne({
      where: { name },
    });
    if (existingSkill.category.id === Number(categoryId)) {
      throw new ConflictException(
        'This skill already exists in the selected category',
      );
    }
    // Create and save the skill
    const skill = this.skillRepository.create({ name, category });
    await this.skillRepository.save(skill);
    return {
      status: 'success',
      message: 'Skill successfully created',
      skill,
    };
  }

  async createUserSkills(createUserSkillDto: CreateUserSkillDto) {
    const { userId, skillIds: rawSkillIds } = createUserSkillDto;

    // If rawSkillIds is a string, split it into an array of numbers
    let skillIds: number[] = [];
    if (typeof rawSkillIds === 'string') {
      // Check if it's a string and split it into an array of numbers
      skillIds = rawSkillIds.split(',').map((id) => parseInt(id.trim(), 10));
    } else {
      // If it's already an array, use it directly
      skillIds = rawSkillIds;
    }
    // Check if skillIds is an array
    if (!Array.isArray(skillIds)) {
      throw new ConflictException('skillIds must be an array');
    }
    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ConflictException('User not found');
    }
    // Check if all skills exist
    const skills = await this.skillRepository.find({
      where: { id: In(skillIds) },
    });
    if (skills.length !== skillIds.length) {
      throw new ConflictException('One or more skills not found');
    }
    // Check if the user already has these skills
    const existingUserSkills = await this.userSkillsRepository.find({
      where: { user, skill: In(skillIds) },
    });
    if (existingUserSkills.length > 0) {
      throw new ConflictException(
        'User already has one or more of these skills',
      );
    }
    // Create and save the user-skill relationships
    const userSkills = skillIds.map((skillId) => {
      const skill = skills.find((s) => s.id === skillId);
      return this.userSkillsRepository.create({ user, skill });
    });
    await this.userSkillsRepository.save(userSkills); // Формируем кастомный вывод

    const formattedSkills = userSkills.map((userSkill) => ({
      id: userSkill.id,
      skill: {
        id: userSkill.skill.id,
        name: userSkill.skill.name,
        category: {
          id: userSkill.skill.category.id,
          name: userSkill.skill.category.name,
        },
      },
    }));

    return {
      status: 'success',
      message: 'User skills successfully created',
      user: {
        id: user.id,
        username: user.username,
      },
      skills: formattedSkills,
    };
  }
}
