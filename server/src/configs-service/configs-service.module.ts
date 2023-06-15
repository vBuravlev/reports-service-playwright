import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from 'nestjs-pino';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigsServiceService } from './configs-service.service';
import { ConfigsServiceController } from './configs-service.controller';
import { Config } from './configs-service.model';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReportsModule } from 'reports/reports.module';
import { ConfigCleanCronEventDto } from 'tasks/dto/clean-cron.dto';

@Module({
  providers: [ConfigsServiceService, ConfigCleanCronEventDto],
  controllers: [ConfigsServiceController],
  imports: [
    SequelizeModule.forFeature([Config]),
    LoggerModule.forRoot(),
    EventEmitterModule.forRoot({
      newListener: true
    }),
    forwardRef(() => ReportsModule)
  ],
  exports: [ConfigsServiceService]
})
export class ConfigsServiceModule { }
