import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateMachineDto } from './dto/create-machine.dto';
import { QueryMachineDto } from './dto/query-machine.dto';

@Injectable()
export class MachineService {
  private readonly logger = new Logger(MachineService.name);
  private readonly machineServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.machineServiceUrl =
      this.configService.get('MACHINE_SERVICE_URL') || 'http://localhost:3002';
    this.logger.log(`Machine Service URL: ${this.machineServiceUrl}`);
  }

  async create(userId: string, createMachineDto: CreateMachineDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.machineServiceUrl}/machines`,
          createMachineDto,
          {
            headers: { 'x-user-id': userId },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Machine service create error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        throw new ServiceUnavailableException('Machine service is unavailable');
      }
      throw error;
    }
  }

  async findAll(userId: string, query: QueryMachineDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.machineServiceUrl}/machines`, {
          params: query,
          headers: { 'x-user-id': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Machine service list error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        throw new ServiceUnavailableException('Machine service is unavailable');
      }
      throw error;
    }
  }
}
