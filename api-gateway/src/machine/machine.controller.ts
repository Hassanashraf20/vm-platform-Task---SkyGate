import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { QueryMachineDto } from './dto/query-machine.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('api/machines')
@UseGuards(JwtAuthGuard)
export class MachineController {
  private readonly logger = new Logger(MachineController.name);

  constructor(private readonly machineService: MachineService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createMachineDto: CreateMachineDto) {
    const userId = req.user.userId;
    this.logger.log(
      `VM creation request from user ${userId} for hostname: ${createMachineDto.hostname}`,
    );

    try {
      const result = await this.machineService.create(userId, createMachineDto);
      this.logger.log(`VM created successfully: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`VM creation failed: ${error.message}`);

      if (error.response?.data) {
        throw new HttpException(
          error.response.data,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create virtual machine',
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() req, @Query() query: QueryMachineDto) {
    const userId = req.user.userId;
    this.logger.log(
      `VM list request from user ${userId} (page: ${query.page}, limit: ${query.limit})`,
    );
    try {
      const result = await this.machineService.findAll(userId, query);
      this.logger.log(`Retrieved ${result.data.length} VMs for user ${userId}`);
      return result;
    } catch (error) {
      this.logger.error(`VM list retrieval failed: ${error.message}`);

      if (error.response?.data) {
        throw new HttpException(
          error.response.data,
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to retrieve virtual machines',
      );
    }
  }
}
