import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeConfigService } from './config-db/sequelizeConfig.service';
import { databaseConfig } from './config-db/configuration';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { FilesModule } from './files/files.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigsServiceModule } from './configs-service/configs-service.module';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';


@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
      expandVariables: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP'
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    ReportsModule,
    FilesModule,
    TasksModule,
    ConfigsServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

// eslint-disable-next-line prettier/prettier
export class AppModule { }
