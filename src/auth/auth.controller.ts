import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDto, LoginDto, CheckEmailDto } from './dto/auth.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto }) // Defines the request body
  @ApiResponse({ status: 200, description: 'Successful login' })
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }

  @Post('register')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User register' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Successful register' })
  async register(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }

  @Post('check_email')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User check email' })
  @ApiBody({ type: CheckEmailDto })
  @ApiResponse({ status: 200, description: 'Successful register' })
  async check_email(@Body() user: CheckEmailDto) {
    return this.authService.check_email(user);
  }
}
