import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Machine } from './entities/machine.entity';
import { CreateMachineDto } from './dto/create-machine.dto';
import { QueryMachineDto } from './dto/query-machine.dto';
import { MachineStatus } from './Enums/MachineStatus.enums';

@Injectable()
export class MachineService {
  private readonly logger = new Logger(MachineService.name);

  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, createMachineDto: CreateMachineDto) {
    this.logger.log(
      `Creating VM '${createMachineDto.hostname}' for user ${userId}`,
    );
    // Check for duplicate hostname for this user (idempotency)
    const existingMachine = await this.machineRepository.findOne({
      where: {
        userId,
        hostname: createMachineDto.hostname,
      },
    });
    if (existingMachine) {
      this.logger.warn(
        `Duplicate hostname '${createMachineDto.hostname}' for user ${userId}`,
      );
      throw new BadRequestException(
        `A machine with hostname '${createMachineDto.hostname}' already exists`,
      );
    }
    try {
      // Create machine in provisioning state
      const machine = this.machineRepository.create({
        userId,
        hostname: createMachineDto.hostname,
        password: createMachineDto.password,
        cpuCores: createMachineDto.cpuCores,
        memorySize: createMachineDto.memorySize,
        diskSize: createMachineDto.diskSize,
        os: createMachineDto.os,
        status: MachineStatus.PROVISIONING,
      });

      const savedMachine = await this.machineRepository.save(machine);

      this.logger.log(
        `Machine ${savedMachine.id} created in PROVISIONING state`,
      );
      // Start async provisioning process
      this.provisionMachine(savedMachine.id).catch((error) => {
        this.logger.error(
          `Failed to provision machine ${savedMachine.id}: ${error.message}`,
        );
      });

      return {
        id: savedMachine.id,
        hostname: savedMachine.hostname,
        status: savedMachine.status,
        cpuCores: savedMachine.cpuCores,
        memorySize: savedMachine.memorySize,
        diskSize: savedMachine.diskSize,
        os: savedMachine.os,
        message: 'Virtual machine creation initiated',
        createdAt: savedMachine.createdAt,
      };
    } catch (error) {
      this.logger.error(`Failed to create machine: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to create virtual machine',
      );
    }
  }

  async findAllByUser(userId: string, query: QueryMachineDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    try {
      const [machines, total] = await this.machineRepository.findAndCount({
        where: { userId },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      this.logger.log(
        `Retrieved ${machines.length} machines for user ${userId} (page ${page})`,
      );

      return {
        data: machines.map((machine) => ({
          id: machine.id,
          hostname: machine.hostname,
          cpuCores: machine.cpuCores,
          memorySize: machine.memorySize,
          diskSize: machine.diskSize,
          os: machine.os,
          status: machine.status,
          ipAddress: machine.ipAddress,
          errorMessage: machine.errorMessage,
          createdAt: machine.createdAt,
          updatedAt: machine.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve machines for user ${userId}: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to retrieve machines');
    }
  }

  private async provisionMachine(machineId: string): Promise<void> {
    const minDelay =
      +this.configService.get('VM_PROVISIONING_MIN_DELAY') || 2000;
    const maxDelay =
      +this.configService.get('VM_PROVISIONING_MAX_DELAY') || 5000;
    const failureRate = +this.configService.get('VM_FAILURE_RATE') || 0.1;

    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    await new Promise((resolve) => setTimeout(resolve, delay));
    try {

      if (Math.random() < failureRate) {
        throw new Error('Hypervisor resource allocation failed');
      }
      const ipAddress = this.generateMockIpAddress();
      await this.machineRepository.update(machineId, {
        status: MachineStatus.RUNNING,
        ipAddress,
        errorMessage: "null",
      });

      this.logger.log(
        `Machine ${machineId} provisioned successfully with IP ${ipAddress}`,
      );
    } catch (error) {
      await this.machineRepository.update(machineId, {
        status: MachineStatus.FAILED,
        errorMessage: error.message,
      });
      this.logger.error(
        `Machine ${machineId} provisioning failed: ${error.message}`,
      );
    }
  }
    private generateMockIpAddress(): string {
    const octet2 = Math.floor(Math.random() * 256);
    const octet3 = Math.floor(Math.random() * 256);
    const octet4 = Math.floor(Math.random() * 254) + 1; // Avoid .0
    return `192.168.${octet2}.${octet3}`;
  }
}
