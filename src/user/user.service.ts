import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import * as process from 'node:process';
import { v4 as uuidv4 } from 'uuid';

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

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = join(process.cwd(), 'uploads');

    // Генерируем уникальное имя файла с сохранением расширения
    const fileExtension = file.originalname.split('.').pop(); // Получаем расширение файла
    const uniqueName = `${uuidv4()}.${fileExtension}`; // Генерируем уникальное имя

    const uploadPath = join(uploadDir, uniqueName);
    // Асинхронно записываем файл
    await writeFile(uploadPath, file.buffer);
    return uniqueName;
  }

  async updateAvatar(
    avatarUrl: string,
    { id }: { username: string; id: number },
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.avatar = avatarUrl;
    await this.userRepository.save(user);

    return {
      message: 'Avatar updated successfully',
      avatarUrl: user.avatar,
    };
  }
}
