import {
  Controller,
  Get,
  UseGuards,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  // Применяем JwtAuthGuard к маршруту
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Request user data' })
  async getProfile(@Req() req: any) {
    // req.user будет содержать данные пользователя, извлеченные из токена
    return this.userService.findById(req.user);
  }

  @Put('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload user image' })
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: { user: { username: string; id: number } },
  ) {
    const uniqueName = await this.userService.uploadFile(image);
    return this.userService.updateAvatar(uniqueName, req.user);
  }
}
