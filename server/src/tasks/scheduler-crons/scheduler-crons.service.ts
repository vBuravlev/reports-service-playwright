import { CronJob } from 'cron';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PinoLogger } from "nestjs-pino";
import { SchedulerRegistry } from '@nestjs/schedule';
import { EXCEPTION_CRON_NOT_FOUND_ERROR } from 'constants/exceptions';
import { CronDto } from 'tasks/dto/clean-cron.dto';

@Injectable()
export class SchedulerCronsService {

	constructor(
		private readonly logger: PinoLogger,
		private readonly schedulerRegistry: SchedulerRegistry
	) {
		logger.setContext(SchedulerCronsService.name);
	}

	existCronByName(name: string): boolean {
		const crons = this.getCronsJobs();
		const result = crons.get(name);
		if (result === undefined) return false;
		return true;
	}

	getCronJob(name: string): CronJob {
		const job = this.schedulerRegistry.getCronJob(name);
		if (job) throw new NotFoundException(EXCEPTION_CRON_NOT_FOUND_ERROR(name));
		return job;
	}

	getCronsJobs(): Map<string, CronJob> {
		const jobs = this.schedulerRegistry.getCronJobs();
		for (const [key, value] of jobs.entries()) {
			let next;
			try {
				next = value.nextDates().toJSDate();
			} catch (e) {
				next = 'error: next fire date is in the past!';
			}
			this.logger.warn(`job: ${key} -> next: ${next}`);
		};
		return jobs;
	}

	addCronJob({ name, value, fn, args }: CronDto): CronJob {
		const job = new CronJob(value, async () => {
			await fn(...args);
		});
		this.schedulerRegistry.addCronJob(name, job);
		job.start();
		this.logger.warn(`job ${name} with template '${value}' - start`);
		return job;
	}

	addCronJobs(cronsDto: CronDto[]): CronJob[] {
		const jobs = [];
		for (const cronDto of cronsDto) {
			jobs.push(this.addCronJob(cronDto));
		}
		this.logger.warn(`jobs ${cronsDto.map(cron => cron.name)} - start`);
		return jobs;
	}


	startCronJob(name: string): CronJob {
		const job = this.getCronJob(name);
		job.start();
		this.logger.warn(`Job ${name} start`);
		return job;
	}

	startCronJobs(cronsDto: CronDto[]): CronJob[] {
		const jobs = [];
		for (const cronDto of cronsDto) {
			jobs.push(this.startCronJob(cronDto.name))
		}
		this.logger.warn(`jobs "${cronsDto.map(cron => cron.name)}" start`);
		return jobs;
	}


	stopCronJob(name: string): CronJob {
		const job = this.getCronJob(name);
		job.stop();
		this.logger.warn(`job ${name} stop`);
		return job;
	}

	stopCronJobs(cronsDto: CronDto[]): CronJob[] {
		const jobs = [];
		for (const cronDto of cronsDto) {
			jobs.push(this.stopCronJob(cronDto.name))
		}
		this.logger.warn(`jobs "${cronsDto.map(cron => cron.name)}" stop`);
		return jobs;
	}

	stopAllCronJobs(): Map<string, CronJob> {
		const jobs = this.getCronsJobs();
		for (const [key, value] of Object.entries(jobs)) {
			value.stop();
			this.logger.warn(`job ${key} stop`);
		}
		this.logger.warn(`All jobs stop`);
		return jobs;
	}

	deleteCron(name: string): void {
		if (this.existCronByName(name)) {
			this.schedulerRegistry.deleteCronJob(name);
			this.logger.warn(`job ${name} deleted!`);
		} else {
			this.logger.warn(`job ${name} not exist!`);
		}
	}

	deleteCrons(cronsDto: CronDto[]): void {
		for (const cronDto of cronsDto) {
			this.deleteCron(cronDto.name);
		}
		this.logger.warn(`jobs "${cronsDto.map(cron => cron.name)}" deleted!`);
	}

	deleteAllCrons(): void {
		const jobs = this.getCronsJobs();
		for (const key of Object.keys(jobs)) {
			this.schedulerRegistry.deleteCronJob(key);
			this.logger.warn(`job ${key} delete`);
		}
		this.logger.warn(`All jobs delete`);
	}

	stopCron(name: string) {
		const cron = this.getCronJob(name);
		if (cron.running) {
			cron.stop();
			this.logger.warn(`Cron ${name} stop`);
		}
	}

	stoppedCrons(cronsDto: CronDto[]): void {
		for (const cronDto of cronsDto) {
			if (!this.existCronByName(cronDto.name)) continue;
			const cron = this.getCronJob(cronDto.name);
			if (cron.running) cron.stop();
		}
	}

	startCron(name: string) {
		const cron = this.getCronJob(name);
		if (!cron.running) {
			cron.start();
			this.logger.warn(`Cron ${name} stop`);
		}
	}

	startedCrons(cronsDto: CronDto[]): void {
		for (const cronDto of cronsDto) {
			if (!this.existCronByName(cronDto.name)) continue;
			const cron = this.getCronJob(cronDto.name);
			if (cron.running) cron.stop();
		}
	}

}

