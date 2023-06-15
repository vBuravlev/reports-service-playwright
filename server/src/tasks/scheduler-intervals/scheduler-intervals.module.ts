import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { SchedulerIntervalsService } from './scheduler-intervals.service';

@Module({
  providers: [SchedulerIntervalsService],
  imports: [
    LoggerModule.forRoot(),
  ],
  exports: [SchedulerIntervalsService]
})
export class SchedulerIntervalsModule { }
