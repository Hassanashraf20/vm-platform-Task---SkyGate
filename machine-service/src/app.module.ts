import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { MachineModule } from './machine/machine.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    MachineModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
