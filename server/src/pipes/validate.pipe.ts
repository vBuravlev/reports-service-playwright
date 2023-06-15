import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../validators/validation.exception';
import { FILE_NOT_ATTACHED, ID_VALIDATION_ERROR } from 'constants/exceptions';


@Injectable()
export class ValidationPipe implements PipeTransform<any> {

	async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {

		//@ts-ignore
		const obj = plainToInstance(metatype, value);
		const errors = await validate(obj);
		if (errors.length) {
			let messages = errors.map(err => {
				//@ts-ignore
				return `${err.property} - ${Object.values(err.constraints).join(', ')}`
			})
			throw new ValidationException(messages)
		}
		return value;
	}
}

@Injectable()
export class IdValidationPipe implements PipeTransform<any> {

	async transform(value: string, metadata: ArgumentMetadata): Promise<any> {
		if (metadata.type != 'param') return value;
		const id = parseInt(value);
		if (!id || !Number.isInteger(id)) throw new BadRequestException(ID_VALIDATION_ERROR);
		return id;
	}
}


@Injectable()
export class FileValidationPipe implements PipeTransform<any> {

	async transform(file: any): Promise<any> {
		if (!file) throw new BadRequestException(FILE_NOT_ATTACHED);
		if (file.size <= 0) throw new BadRequestException(ID_VALIDATION_ERROR);
		return file;
	}
}