
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsCronTime } from 'configs-service/decorators/cron-time.decorator';

export class CreateConfigsServiceDto {

	@ApiProperty({
		example: 'DefaultConfig',
		description: 'Название конфига',
		required: true
	})
	@IsString({ message: 'Поле name должно быть строкой' })
	@IsNotEmpty({ message: 'Поле name не должно быть пустым' })
	name: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки устаревших отчетов',
		required: true
	})
	@IsString({ message: 'Поле cron_clearing_report должно быть строкой' })
	@IsNotEmpty({ message: 'Поле cron_clearing_report не должно быть пустым' })
	@IsCronTime({ message: 'Поле cron_clearing_report должно соответствовать CronExpression' })
	cron_clearing_report: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки мусора в директориях с отчетами',
		required: true
	})
	@IsString({ message: 'Поле cron_clearing_garbage должно быть строкой' })
	@IsNotEmpty({ message: 'Поле cron_clearing_garbage не должно быть пустым' })
	@IsCronTime({ message: 'Поле cron_clearing_garbage должно соответствовать CronExpression' })
	cron_clearing_garbage: string;

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
	report_storage_period: number;

	@ApiProperty({
		example: true,
		description: 'Статус "Текущий конфиг"',
		required: true
	})
	@IsBoolean({ message: 'Поле current_config должно быть boolean' })
	@IsNotEmpty({ message: 'Поле current_config не должно быть пустым' })
	current_config: boolean;

	@ApiProperty({
		example: false,
		description: 'Статус "Стандартный конфиг"',
		required: false
	})
	@IsBoolean({ message: 'Поле current_config должно быть boolean' })
	@IsNotEmpty({ message: 'Поле current_config не должно быть пустым' })
	is_default_config: boolean;

	@ApiProperty({
		example: true,
		description: 'Включение Автоочистки',
	})
	@IsBoolean({ message: 'Поле is_auto_clean должно быть boolean' })
	@IsNotEmpty({ message: 'Поле is_auto_clean не должно быть пустым' })
	is_auto_clean: boolean;

}