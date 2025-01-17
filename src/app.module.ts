import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './jwt/jwt.service';
import { UserModule } from './user/user.module';
import { User } from './user/entity/user.entity';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает переменные окружения доступными по всему проекту
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Импортируем ConfigModule
      inject: [ConfigService], // Внедряем ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User],
        synchronize: true,
        // logging: true,
      }),
    }),
    AuthModule,
    UserModule,
  ],
  providers: [JwtStrategy, EmailService],
})
export class AppModule {}
