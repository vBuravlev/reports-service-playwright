import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { SchedulerTimeoutsService } from './scheduler-timeouts.service';

@Module({
  providers: [SchedulerTimeoutsService],
  imports: [
    LoggerModule.forRoot(),
  ],
  exports: [SchedulerTimeoutsService]
})
export class SchedulerTimeoutsModule { }
