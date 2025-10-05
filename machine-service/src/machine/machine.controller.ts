import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { QueryMachineDto } from './dto/query-machine.dto';

@Controller('machines')
export class MachineController {
  private readonly logger = new Logger(MachineController.name);

  constructor(private readonly machineService: MachineService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Headers('x-user-id') userId: string,
    @Body() createMachineDto: CreateMachineDto,
  ) {
    if (!userId) {
      this.logger.warn('Machine creation attempt without user ID');
      throw new UnauthorizedException('User ID is required');
    }

    this.logger.log(`Creating machine for user: ${userId}`);
    return this.machineService.create(userId, createMachineDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Headers('x-user-id') userId: string,
    @Query() query: QueryMachineDto,
  ) {
    if (!userId) {
      this.logger.warn('Machine list request without user ID');
      throw new UnauthorizedException('User ID is required');
    }

    this.logger.log(`Fetching machines for user: ${userId}`);
    return this.machineService.findAllByUser(userId, query);
  }
}