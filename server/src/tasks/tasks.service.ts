import { PinoLogger } from "nestjs-pino";
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { SchedulerTimeoutsService } from './scheduler-timeouts/scheduler-timeouts.service';
import { SchedulerCronsService } from './scheduler-crons/scheduler-crons.service';
import { SchedulerIntervalsService } from './scheduler-intervals/scheduler-intervals.service';
import { CronDto, ConfigCleanCronEventDto, CronCleanersDto } from './dto/clean-cron.dto';
import { CleaningCrons } from './enum/crons.enum';
import { ConfigCronsEvent } from 'events/enum/configs.enum';
import { CronsTimeTemplates, EventemitterInterface } from './types/interfaces';
import { ReportsEnum } from 'events/enum/reports.enum';
import { EXCEPTION_CONFIG } from 'constants/exceptions';


@Injectable()
export class TasksService {

	private current_config: ConfigCleanCronEventDto;

	constructor(
		private readonly logger: PinoLogger,
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly schedulerTimeoutsService: SchedulerTimeoutsService,
		private readonly schedulerCronsService: SchedulerCronsService,
		private readonly schedulerIntervalsService: SchedulerIntervalsService,
		private readonly eventEmitter: EventEmitter2
	) {
		logger.setContext(TasksService.name);
	}

	public cleanGarbageReports: EventemitterInterface = async () =>
		this.eventEmitter.emit(ReportsEnum.CLEAN_REPORTS_GARBAGE);

	public cleanOldReports: EventemitterInterface = async (time: number) =>
		this.eventEmitter.emit(ReportsEnum.CLEAN_REPORTS_OLD, [time]);

	private setCurrentConfig(data: ConfigCleanCronEventDto): void {
		this.current_config = data;
	}

	private getCurrentConfig(): ConfigCleanCronEventDto {
		return this.current_config;
	}

	@OnEvent(ConfigCronsEvent.CONFIG_UPDATE)
	async handleConfigUpdatedEvent(payload: ConfigCleanCronEventDto) {
		try {
			this.setCurrentConfig(payload);
			await this.startCleaningCrons();
		} catch (e) {
			this.logger.error(`Error cron cleaning`, e);
		}
	}

	@Cron(new Date(Date.now() + 5 * 1000), {
		name: CleaningCrons.START_CRON
	})
	updateCurrentConfig() {
		try {
			this.eventEmitter.emit(ConfigCronsEvent.UPDATE_CRONS);
		} catch (e) {
			this.logger.error(`${ConfigCronsEvent.UPDATE_CRONS} emit error`, e);
		}
	}

	async startCleaningCrons(): Promise<CronDto[] | undefined> {
		try {
			const crons = await this.getCleanCrons();
			if (!crons) throw new NotFoundException(EXCEPTION_CONFIG);
			const { cronsCleaner, is_auto_clean } = crons;
			if (is_auto_clean) {
				this.schedulerCronsService.deleteCrons(cronsCleaner);
				this.schedulerCronsService.addCronJobs(cronsCleaner);
			} else {
				this.schedulerCronsService.deleteCrons(cronsCleaner);
			}
			return cronsCleaner;
		} catch (e) {
			this.logger.error(`Error cron cleaning`, e);
		}
	}

	async getCleanCrons(): Promise<CronCleanersDto | undefined> {
		try {
			const {
				cron_clearing_garbage,
				cron_clearing_report,
				report_storage_period,
				is_auto_clean
			} = this.getCurrentConfig();

			const cronClearingGarbage = new CronDto(
				CleaningCrons.CRON_CLEARING_GARBAGE,
				cron_clearing_garbage,
				this.cleanGarbageReports,
				[]
			);

			const cronClearingReport = new CronDto(
				CleaningCrons.CRON_CLEARING_REPORT,
				cron_clearing_report,
				this.cleanOldReports,
				[report_storage_period]
			);

			const cronsCleaner = [
				cronClearingGarbage,
				cronClearingReport
			];
			return {
				cronsCleaner,
				is_auto_clean
			}
		} catch (e) {
			this.logger.error(`Error crons`, e);
		}
	}

	@OnEvent(ConfigCronsEvent.GET_CRON_TIME_UPDATE)
	getTemplatesCrons(): CronsTimeTemplates {
		const templates: { [key: string]: string } = {};
		for (const [key, value] of Object.entries(CronExpression)) {
			templates[key] = value;
		}
		this.eventEmitter.emit(ConfigCronsEvent.SEND_CRON_TIME, { templates });
		return { templates };
	}

}
