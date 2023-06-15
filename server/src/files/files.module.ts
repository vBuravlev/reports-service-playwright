import { Module, forwardRef } from '@nestjs/common';
import { FilesService } from './files.service';
import { LoggerModule } from "nestjs-pino";
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReportsModule } from 'reports/reports.module';

@Module({
  providers: [FilesService],
  exports: [FilesService],
  imports: [
    LoggerModule.forRoot(),
    EventEmitterModule.forRoot(),
    forwardRef(() => ReportsModule)
  ]
})
export class FilesModule { }
