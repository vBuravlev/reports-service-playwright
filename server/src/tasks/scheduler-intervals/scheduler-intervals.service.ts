import { Injectable, NotFoundException } from '@nestjs/common';
import { PinoLogger } from "nestjs-pino";
import { SchedulerRegistry } from '@nestjs/schedule';
import { EXCEPTION_INTERVAL_NOT_FOUND_ERROR } from 'constants/exceptions';


@Injectable()
export class SchedulerIntervalsService {

	constructor(
		private readonly logger: PinoLogger,
		private readonly schedulerRegistry: SchedulerRegistry
	) {
		logger.setContext(SchedulerIntervalsService.name);
	}

	addInterval(name: string, milliseconds: number, command: (() => void)) {
		const interval = setInterval(command, milliseconds);
		this.schedulerRegistry.addInterval(name, interval);
		this.logger.warn(`Interval ${name} executing at time (${milliseconds})!`);
		return interval;
	}


	clearInterval(name: string) {
		const interval = this.schedulerRegistry.getInterval(name);
		if (interval) throw new NotFoundException(EXCEPTION_INTERVAL_NOT_FOUND_ERROR(name));
		clearInterval(interval);
		this.logger.warn(`Interval ${name} cleared!`);
	}


	deleteInterval(name: string) {
		this.getInterval(name);
		this.schedulerRegistry.deleteInterval(name);
		this.logger.warn(`Interval ${name} deleted!`);
	}

	getIntervals() {
		const intervals = this.schedulerRegistry.getIntervals();
		for (const interval of intervals) this.logger.warn(`Interval: ${interval}`);
		return intervals;
	}

	getInterval(name: string) {
		const interval = this.schedulerRegistry.getInterval(name);
		if (interval) throw new NotFoundException(EXCEPTION_INTERVAL_NOT_FOUND_ERROR(name));
		this.logger.warn(`Interval: ${interval}`);
		return interval;
	}


}
