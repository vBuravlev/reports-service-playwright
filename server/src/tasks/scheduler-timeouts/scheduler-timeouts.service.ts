import { Injectable, NotFoundException } from '@nestjs/common';
import { PinoLogger } from "nestjs-pino";
import { SchedulerRegistry } from '@nestjs/schedule';
import { EXCEPTION_TIMEOUT_NOT_FOUND_ERROR } from 'constants/exceptions';

@Injectable()
export class SchedulerTimeoutsService {

	constructor(
		private readonly logger: PinoLogger,
		private readonly schedulerRegistry: SchedulerRegistry
	) {
		logger.setContext(SchedulerTimeoutsService.name);
	}

	getTimeout(name: string) {
		const timeout = this.schedulerRegistry.getTimeout(name);
		if (timeout) throw new NotFoundException(EXCEPTION_TIMEOUT_NOT_FOUND_ERROR(name));
		return timeout;
	}


	addTimeout(name: string, milliseconds: number) {
		const callback = () => {
			this.logger.warn(`Timeout ${name} executing after (${milliseconds})!`);
		};
		const timeout = setTimeout(callback, milliseconds);
		this.schedulerRegistry.addTimeout(name, timeout);
		return timeout;
	}

	clearTimeout(name: string) {
		const timeout = this.getTimeout(name);
		clearTimeout(timeout);
		this.logger.warn(`Interval ${name} cleared!`);
	}

	deleteTimeout(name: string) {
		this.getTimeout(name);
		this.schedulerRegistry.deleteTimeout(name);
		this.logger.warn(`Timeout ${name} deleted!`);
	}

	getTimeouts() {
		const timeouts = this.schedulerRegistry.getTimeouts();
		for (const timeout of timeouts) this.logger.warn(`Timeout: ${timeout}`);
		return timeouts;
	}


}
