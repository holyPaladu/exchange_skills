import {
  ConflictException,
  Injectable,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto, CheckEmailDto } from './dto/auth.dto';
import { EmailService } from '../email/email.service';
import { Skill } from 'src/skill/entity/skill.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async register(dto: RegisterDto) {
    const { password, email, username, skills } = dto;
    // Выполнение независимых операций параллельно
    const [existingUser, skillEntities] = await Promise.all([
      this.userRepository.findOne({ where: { email } }), // Проверка пользователя
      this.skillRepository.findBy({ id: In(skills) }), // Получение навыков
    ]);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    // Генерация случайного кода для подтверждения
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      email,
      ottp: verificationCode,
      password: hashedPassword,
      skills: skillEntities,
    });
    await this.userRepository.save(newUser);
    await this.emailService.sendVerificationEmail(email, verificationCode);
    return {
      status: HttpStatus.CREATED,
      message: 'User successfully registered',
    };
  }

  @HttpCode(HttpStatus.OK)
  async login({ password, email }: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('There is no such user');
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('The passwords do not match');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }

  @HttpCode(HttpStatus.OK)
  async check_email({ email, ottp }: CheckEmailDto) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('There is no such user');
    if (user.isEmailVerified) {
      throw new UnauthorizedException('Email already verified');
    } else {
      const isEmail = user.ottp === ottp;
      if (!isEmail) {
        user.isEmailVerified = false;
        throw new UnauthorizedException('Invalid code');
      } else {
        user.isEmailVerified = true;
        user.ottp = '';
        // Сохранение изменений в базе данных
        await this.userRepository.save(user);
      }
    }
    return {
      status: HttpStatus.OK,
      message: 'Your email verificated',
    };
  }
}
