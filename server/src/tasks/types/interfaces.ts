import { CronExpression } from '@nestjs/schedule';

export interface CronClearingGarbage {
	name: string,
	value: string,
	fn: EventemitterInterface,
	args: any[],
};

export interface EventemitterInterface {
	(...args: any[]): Promise<void | boolean | number | string>;
}

export interface CronsTimeTemplates {
	templates: { [key: string]: string },
}