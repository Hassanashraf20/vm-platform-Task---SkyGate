import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  HttpException,
  InternalServerErrorException,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration request for: ${registerDto.email}`);
    try {
      const result = await this.authService.register(registerDto);
      this.logger.log(`Registration successful for: ${registerDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Registration failed for ${registerDto.email}: ${error.message}`,
      );
      if (error.response?.data) {
        throw new HttpException(
          error.response.data,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw new InternalServerErrorException(
        error.message || 'Registration failed',
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login request for: ${loginDto.email}`);
    try {
      const result = await this.authService.login(loginDto);
      this.logger.log(`Login successful for: ${loginDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed for ${loginDto.email}: ${error.message}`);
      if (error.response?.data) {
        throw new HttpException(
          error.response.data,
          error.response.status || HttpStatus.UNAUTHORIZED,
        );
      }
      throw new InternalServerErrorException(error.message || 'Login failed');
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.log('Token refresh request');
    try {
      const result = await this.authService.refresh(
        refreshTokenDto.refreshToken,
      );
      this.logger.log('Token refresh successful');
      return result;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      if (error.response?.data) {
        throw new HttpException(
          error.response.data,
          error.response.status || HttpStatus.UNAUTHORIZED,
        );
      }
      throw new InternalServerErrorException(
        error.message || 'Token refresh failed',
      );
    }
  }

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Req() req: any) {
  return req.user;
}
}
