interface ToNumberOptions {
	default?: number;
	min?: number;
	max?: number;
}

export function toLowerCase(value: string): string {
	return value.toLowerCase();
}

export function trim(value: string): string {
	return value.trim();
}

export function toDate(value: string): Date {
	return new Date(value);
}

export function toBoolean(value: string): boolean {
	const newValue: string = value.toLowerCase();
	return newValue === 'true' || newValue === '1' ? true : false;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
	let newValue: number = Number.parseInt(value || String(opts.default), 10);
	if (Number.isNaN(newValue) && opts.default) newValue = opts.default;
	if (opts.min && newValue < opts.min) newValue = opts.min;
	if (opts.max && newValue > opts.max) newValue = opts.max;
	return newValue;
}

export function filterUndefined(params: { [key: string]: any }): { [key: string]: any } {
	const newParams: { [key: string]: any } = {};
	for (const [key, value] of Object.entries(params)) {
		if (key !== undefined && value !== undefined) newParams[key] = value;
	}
	return newParams;
}
