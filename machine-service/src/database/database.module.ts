import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from 'src/machine/entities/machine.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<any>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        schema: 'SkyGate_cloud_db',
        entities: [Machine],
        synchronize: true,
        extra: {
          trustServerCertificate: true,
          encrypt: true,
          enableArithAbort: true,
        },
        options: {
          encrypt: true, // For Azure SQL
          trustServerCertificate: true, // For self-signed certs
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
