import { CronClearingGarbage, EventemitterInterface } from 'tasks/types/interfaces';

export class CronDto implements CronClearingGarbage {

	constructor(
		public readonly name: string,
		public readonly value: string,
		public readonly fn: EventemitterInterface,
		public readonly args: any[],
	) { }

}

export class CronCleanersDto {

	constructor(
		public readonly cronsCleaner: CronDto[],
		public readonly is_auto_clean: boolean,
	) { }

}

export class ConfigCleanCronEventDto {
	constructor(
		public readonly cron_clearing_garbage: string,
		public readonly cron_clearing_report: string,
		public readonly report_storage_period: number,
		public readonly is_auto_clean: boolean
	) { }

}