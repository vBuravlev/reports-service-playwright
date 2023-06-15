import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Config } from 'configs-service/configs-service.model';


export class FindAllCountConfigsResponse {
	@ApiProperty({ example: '100', description: 'Количество конфигов', required: true })
	@IsNumber({
		allowNaN: false,
		allowInfinity: false
	}, { message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле number не должно быть пустым' })
	readonly count: number;

	//TODO дополнить пример
	@ApiProperty({
		example: ` "id": 4,
        "name": "newConfig969480a1-d330-4f75-856f-6a7965259186",
        "cron_clearing_report": "*/30 * * * * *",
        "cron_clearing_garbage": "*/30 * * * * *",
        "report_storage_period": 100000,
        "current_config": true,
        "is_default_config": false,
        "is_auto_clean": true,
        "createdAt": "2023-05-28T06:19:32.730Z",
        "updatedAt": "2023-05-28T06:21:59.756Z"`,
		description: 'Пароль пользователя', required: true
	})
	@IsNotEmpty({ message: 'Поле configs не должно быть пустым' })
	readonly configs: Config[];

}