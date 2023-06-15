
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateConfigsServiceDto {

	@ApiProperty({
		example: 'DefaultConfig',
		description: 'Название конфига',
		required: false
	})
	@IsString({ message: 'Поле name должно быть строкой' })
	@IsNotEmpty({ message: 'Поле name не должно быть пустым' })
	name: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки устаревших отчетов',
		required: false
	})
	@IsString({ message: 'Поле cron_clearing_report должно быть строкой' })
	@IsNotEmpty({ message: 'Поле cron_clearing_report не должно быть пустым' })
	cron_clearing_report: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки мусора в директориях с отчетами',
		required: false
	})
	@IsString({ message: 'Поле cron_clearing_garbage должно быть строкой' })
	@IsNotEmpty({ message: 'Поле cron_clearing_garbage не должно быть пустым' })
	cron_clearing_garbage: string;

	@ApiProperty({
		example: '1209600000',
		description: 'Период хранения отчетов в мс',
		required: false
	})
	@IsNumber(
		{ allowNaN: true, allowInfinity: true },
		{ message: 'Поле report_storage_period должно быть числом' }
	)
	@IsNotEmpty({ message: 'Поле report_storage_period не должно быть пустым' })
	report_storage_period: number;

	@ApiProperty({
		example: true,
		description: 'Статус "Текущий конфиг"',
	})
	@IsBoolean({ message: 'Поле current_config должно быть boolean' })
	@IsNotEmpty({ message: 'Поле current_config не должно быть пустым' })
	@IsOptional()
	current_config?: boolean;

}


export class UpdateParamsConfigsServiceDto {

	@ApiProperty({
		example: 'DefaultConfig',
		description: 'Название конфига',
	})
	@IsString({ message: 'Поле name должно быть строкой' })
	@IsNotEmpty({ message: 'Поле name не должно быть пустым' })
	@IsOptional()
	name?: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки устаревших отчетов',
	})
	@IsString({ message: 'Поле cron_clearing_report должно быть строкой' })
	@IsNotEmpty({ message: 'Поле cron_clearing_report не должно быть пустым' })
	@IsOptional()
	cron_clearing_report?: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки мусора в директориях с отчетами',
	})
	@IsString({ message: 'Поле cron_clearing_garbage должно быть строкой' })
	@IsNotEmpty({ message: 'Поле cron_clearing_garbage не должно быть пустым' })
	@IsOptional()
	cron_clearing_garbage?: string;

	@ApiProperty({
		example: '1209600000',
		description: 'Период хранения отчетов в мс',
	})
	@IsNumber(
		{ allowNaN: true, allowInfinity: true },
		{ message: 'Поле report_storage_period должно быть числом' }
	)
	@IsNotEmpty({ message: 'Поле report_storage_period не должно быть пустым' })
	@IsOptional()
	report_storage_period?: number;

	@ApiProperty({
		example: true,
		description: 'Статус "Текущий конфиг"',
	})
	@IsBoolean({ message: 'Поле current_config должно быть boolean' })
	@IsNotEmpty({ message: 'Поле current_config не должно быть пустым' })
	@IsOptional()
	current_config?: boolean;

	@ApiProperty({
		example: true,
		description: 'Включение Автоочистки',
	})
	@IsBoolean({ message: 'Поле is_auto_clean должно быть boolean' })
	@IsNotEmpty({ message: 'Поле is_auto_clean не должно быть пустым' })
	@IsOptional()
	is_auto_clean?: boolean;

}

export class SwitchCurrentConfigServiceDto {

	@ApiProperty({
		example: '4',
		description: 'ID конфига, который нужно сделать текущим',
	})
	@IsNumber({}, { message: 'Поле id должно быть number' })
	@IsNotEmpty({ message: 'Поле id не должно быть пустым' })
	id: number;

}

