import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { SchedulerCronsService } from './scheduler-crons.service';

@Module({
  providers: [SchedulerCronsService],
  imports: [
    LoggerModule.forRoot(),
  ],
  exports: [SchedulerCronsService]
})
export class SchedulerCronsModule { }
