import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './reports.model';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';
import { LoggerModule } from "nestjs-pino";
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [
    SequelizeModule.forFeature([Report]),
    forwardRef(() => FilesModule),
    forwardRef(() => UsersModule),
    LoggerModule.forRoot(),
    EventEmitterModule.forRoot()
  ],
  exports: [ReportsService]
})
export class ReportsModule { }
