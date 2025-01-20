import { Injectable } from '@nestjs/common';
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
    return this.userRepository.findOne({
      where: { id },
      relations: ['skills'], // Если UserSkills связано с Skill
    });
  }
}
