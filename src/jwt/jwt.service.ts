import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'), // Use secret from .env file
    });
  }

  async validate(payload: any) {
    // Здесь payload — это данные, которые были закодированы в токене
    return { id: payload.sub, username: payload.username }; // Эти данные будут добавлены в req.user
  }
}
