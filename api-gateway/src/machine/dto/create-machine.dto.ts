import {
  IsString,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateMachineDto {
  @IsString({ message: 'Hostname must be a string' })
  @MinLength(3, { message: 'Hostname must be at least 3 characters' })
  @MaxLength(255, { message: 'Hostname must not exceed 255 characters' })
  hostname: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(255, { message: 'Password must not exceed 255 characters' })
  password: string;

  @IsInt({ message: 'CPU cores must be an integer' })
  @Min(1, { message: 'CPU cores must be at least 1' })
  @Max(64, { message: 'CPU cores must not exceed 64' })
  cpuCores: number;

  @IsInt({ message: 'Memory size must be an integer' })
  @Min(1, { message: 'Memory size must be at least 1 GB' })
  @Max(512, { message: 'Memory size must not exceed 512 GB' })
  memorySize: number;

  @IsInt({ message: 'Disk size must be an integer' })
  @Min(10, { message: 'Disk size must be at least 10 GB' })
  @Max(10000, { message: 'Disk size must not exceed 10000 GB' })
  diskSize: number;

  @IsString({ message: 'OS must be a string' })
  @MinLength(3, { message: 'OS name must be at least 3 characters' })
  @MaxLength(100, { message: 'OS name must not exceed 100 characters' })
  os: string;
}
