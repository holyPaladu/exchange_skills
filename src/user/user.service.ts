import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById({ id, username }: { id: number; username: string }) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['skills'], // Если UserSkills связано с Skill
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ottp, deletedAt, ...last } = user;
    return last;
  }
}
