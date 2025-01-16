import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../jwt/jwt.service';
import { User } from '../user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      inject: [ConfigService], // Inject ConfigService to retrieve values
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'), // Get JWT secret from .env
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        }, // Get expiration time from .env
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailService],
})
export class AuthModule {}
