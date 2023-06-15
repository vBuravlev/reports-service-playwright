import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Report } from 'reports/reports.model';


export class FindAllCountReportsResponse {
	@ApiProperty({ example: '100', description: 'Количество отчетов', required: true })
	@IsNumber({
		allowNaN: false,
		allowInfinity: false
	}, { message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле number не должно быть пустым' })
	count: number;

	//TODO дополнить пример
	@ApiProperty({
		example: ` "id": 91,
            "title": "Отчет по тестированию 35315d40-303c-4f76-8159-feeca4d2bffc",
            "project_name": "test",
            "test_project_id": "ae45-55gy-5jjr",
            "test_plan_id": "0d2e38d7-6fa4-4012-ba3c-99b26afb3e70",
            "test_run_id": "6645e4a9-40eb-4af0-8cf6-359816b9da27",
            "path_report": "01H1JGY3FK4JXGC111GZEWG524",
            "is_delete": true,
            "createdAt": "2023-05-29T01:11:05.471Z",
            "updatedAt": "2023-05-29T01:11:05.471Z"`,
		description: 'Пароль пользователя', required: true
	})
	@IsNotEmpty({ message: 'Поле reports не должно быть пустым' })
	reports: Report[];

}