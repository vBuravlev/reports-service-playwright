import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { CronExpression } from '@nestjs/schedule';


export function IsCronTime(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "isCronTime",
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					return typeof value === "string" &&
						Object.values(CronExpression).includes(value as CronExpression)
				}
			}
		});
	};
}