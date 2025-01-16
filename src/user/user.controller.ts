import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  // Применяем JwtAuthGuard к маршруту
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Request user data' })
  getProfile(@Req() req: any) {
    // req.user будет содержать данные пользователя, извлеченные из токена
    return req.user;
  }
}
