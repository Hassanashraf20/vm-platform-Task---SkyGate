import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl =
      this.configService.get('AUTH_SERVICE_URL') ?? 'http://localhost:3001';
    this.logger.log(`Auth Service URL: ${this.authServiceUrl}`);
  }

  async register(registerDto: RegisterDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/auth/register`,
          registerDto,
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Auth service registration error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        throw new ServiceUnavailableException('Auth service is unavailable');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/login`, loginDto),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Auth service login error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        throw new ServiceUnavailableException('Auth service is unavailable');
      }
      throw error;
    }
  }

  async refresh(refreshToken: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/refresh`, {
          refreshToken,
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Auth service refresh error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        throw new ServiceUnavailableException('Auth service is unavailable');
      }
      throw error;
    }
  }

  async validateToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/auth/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      return null;
    }
  }
}
