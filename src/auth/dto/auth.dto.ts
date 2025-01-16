import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User name', example: 'name' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'User password', example: 'strongpassword' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'strongpassword' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CheckEmailDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Ottp code', example: '111111' })
  @IsString()
  @IsNotEmpty()
  ottp: string;
}
