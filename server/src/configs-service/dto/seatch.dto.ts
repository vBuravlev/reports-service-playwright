
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { IsCronTime } from 'configs-service/decorators/cron-time.decorator';

export class FindAllCountConfigDto {

	@ApiProperty({
		example: 'Смещение в выборке отчетов',
		description: 'offset reports',
	})
	@IsNumberString({}, { message: 'Поле offset должно быть числом' })
	@IsNotEmpty({ message: 'Поле offset не должно быть пустым' })
	readonly offset: number;

	@ApiProperty({
		example: 'Количество отчетов в ответе',
		description: 'limit reports',
	})
	@IsNumberString({}, { message: 'Поле limit должно быть числом' })
	@IsNotEmpty({ message: 'Поле limit не должно быть пустым' })
	readonly limit: number;

}


export class SearchConfigsServiceDto {

	@ApiProperty({
		example: 'DefaultConfig',
		description: 'Название конфига',
		required: true
	})
	@IsString({ message: 'Поле name должно быть строкой' })
	@IsNotEmpty({ message: 'Поле name не должно быть пустым' })
	@IsOptional({ message: 'Поле name может отсутствовать в запросе' })
	name?: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки устаревших отчетов',
		required: true
	})
	@IsString({ message: 'Поле cron_clearing_report должно быть строкой' })
	@IsNotEmpty({ message: 'Поле cron_clearing_report не должно быть пустым' })
	@IsCronTime({ message: 'Поле cron_clearing_report должно соответствовать CronExpression' })
	@IsOptional({ message: 'Поле cron_clearing_report может отсутствовать в запросе' })
	cron_clearing_report?: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки мусора в директориях с отчетами',
		required: true
	})
	@IsString({ message: 'Поле cron_clearing_garbage должно быть строкой' })
	@IsNotEmpty({ message: 'Поле cron_clearing_garbage не должно быть пустым' })
	@IsCronTime({ message: 'Поле cron_clearing_garbage должно соответствовать CronExpression' })
	@IsOptional({ message: 'Поле cron_clearing_garbage может отсутствовать в запросе' })
	cron_clearing_garbage?: string;

	@ApiProperty({
		example: '1209600000',
		description: 'Период хранения отчетов в мс',
		required: true
	})
	@IsNumber(
		{ allowNaN: true, allowInfinity: true },
		{ message: 'Поле report_storage_period должно быть числом' }
	)
	@IsNotEmpty({ message: 'Поле report_storage_period не должно быть пустым' })
	@IsOptional({ message: 'Поле report_storage_period может отсутствовать в запросе' })
	report_storage_period?: number;

	@ApiProperty({
		example: true,
		description: 'Статус "Текущий конфиг"',
		required: true
	})
	@IsBoolean({ message: 'Поле current_config должно быть boolean' })
	@IsNotEmpty({ message: 'Поле current_config не должно быть пустым' })
	@IsOptional({ message: 'Поле current_config может отсутствовать в запросе' })
	current_config?: boolean;

	@ApiProperty({
		example: false,
		description: 'Статус "Стандартный конфиг"',
		required: false
	})
	@IsBoolean({ message: 'Поле current_config должно быть boolean' })
	@IsNotEmpty({ message: 'Поле current_config не должно быть пустым' })
	@IsOptional({ message: 'Поле is_default_config может отсутствовать в запросе' })
	is_default_config?: boolean;

	@ApiProperty({
		example: true,
		description: 'Включение Автоочистки',
	})
	@IsBoolean({ message: 'Поле is_auto_clean должно быть boolean' })
	@IsNotEmpty({ message: 'Поле is_auto_clean не должно быть пустым' })
	@IsOptional({ message: 'Поле is_auto_clean может отсутствовать в запросе' })
	is_auto_clean?: boolean;


	@ApiProperty({
		example: 'Смещение в выборке отчетов',
		description: 'offset reports',
	})
	@IsNumberString({}, { message: 'Поле offset должно быть числом' })
	@IsNotEmpty({ message: 'Поле offset не должно быть пустым' })
	readonly offset: number;

	@ApiProperty({
		example: 'Количество отчетов в ответе',
		description: 'limit reports',
	})
	@IsNumberString({}, { message: 'Поле limit должно быть числом' })
	@IsNotEmpty({ message: 'Поле limit не должно быть пустым' })
	readonly limit: number;

}
