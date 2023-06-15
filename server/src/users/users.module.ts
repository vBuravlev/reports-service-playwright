import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { ReportsModule } from 'reports/reports.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => ReportsModule),
    ConfigModule
  ],
})
export class UsersModule { }