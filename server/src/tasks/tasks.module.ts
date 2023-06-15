import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { SchedulerIntervalsModule } from './scheduler-intervals/scheduler-intervals.module';
import { SchedulerCronsModule } from './scheduler-crons/scheduler-crons.module';
import { SchedulerTimeoutsModule } from './scheduler-timeouts/scheduler-timeouts.module';
import { ConfigsServiceModule } from '../configs-service/configs-service.module';
import { TasksService } from './tasks.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [TasksService],
  imports: [
    ConfigsServiceModule,
    LoggerModule.forRoot(),
    SchedulerIntervalsModule,
    SchedulerCronsModule,
    SchedulerTimeoutsModule,
    EventEmitterModule.forRoot({
      newListener: true
    })
  ],
  exports: [TasksService]
})
export class TasksModule { }
