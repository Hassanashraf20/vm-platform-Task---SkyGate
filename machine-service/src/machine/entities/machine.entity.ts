import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { MachineStatus } from '../Enums/MachineStatus.enums';



@Entity('machines')
@Index(['userId', 'hostname'], { unique: true })
export class Machine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @Column({ length: 255 })
  hostname: string;

  @Column({ length: 255 })
  password: string;

  @Column({ name: 'cpu_cores', type: 'int' })
  cpuCores: number;

  @Column({ name: 'memory_size', type: 'int', comment: 'Memory in GB' })
  memorySize: number;

  @Column({ name: 'disk_size', type: 'int', comment: 'Disk size in GB' })
  diskSize: number;

  @Column({ length: 100 })
  os: string;

  @Column({
    name: 'status',
    type: 'nvarchar',
    length: 50,
    default: MachineStatus.PROVISIONING,
  })
  status: MachineStatus;

  @Column({ name: 'ip_address', nullable: true, length: 45 })
  ipAddress: string;

  @Column({ name: 'error_message', nullable: true, type: 'text' })
  errorMessage: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}