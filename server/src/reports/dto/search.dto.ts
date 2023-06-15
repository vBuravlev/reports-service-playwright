import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, isNumberString } from 'class-validator';


export class SearchReportDto {

	@ApiProperty({
		example: '1',
		description: 'report id',
	})
	@IsOptional({ message: 'Поле id может отсутствовать в запросе' })
	@IsNumber({}, { message: 'Поле id должно быть числом' })
	@IsNotEmpty({ message: 'Поле id не должно быть пустым' })
	readonly id?: number;

	@ApiProperty({
		example: 'Отчет для проекта №114',
		description: 'report title',
	})
	@IsOptional({ message: 'Поле title может отсутствовать в запросе' })
	@IsString({ message: 'Поле title должно быть строкой' })
	@IsNotEmpty({ message: 'Поле title не должно быть пустым' })
	readonly title?: string;

	@ApiProperty({
		example: 'project-test',
		description: 'project name',
	})
	@IsOptional({ message: 'Поле project_name может отсутствовать в запросе' })
	@IsString({ message: 'Поле project_name быть строкой' })
	@IsNotEmpty({ message: 'Поле project_name не должно быть пустым' })
	readonly project_name?: string;

	@ApiProperty({
		example: 'false',
		description: 'deleted status of the report',
	})
	@IsOptional({ message: 'Поле is_delete может отсутствовать в запросе' })
	@IsBoolean({ message: 'Поле is_delete должно быть логическим' })
	@IsNotEmpty({ message: 'Поле is_delete не должно быть пустым' })
	readonly is_delete?: boolean;

	@ApiProperty({
		example: '233hs-95kkh-fv2vd-84jjs',
		description: 'test project id',
	})
	@IsOptional({ message: 'Поле test_project_id может отсутствовать в запросе' })
	@IsString({ message: 'Поле test_project_id быть строкой' })
	@IsNotEmpty({ message: 'Поле test_project_id не должно быть пустым' })
	readonly test_project_id?: string;

	@ApiProperty({
		example: '233hs-95kkh-fv2vd-84jjs',
		description: 'test plan id',
	})
	@IsOptional({ message: 'Поле test_plan_id может отсутствовать в запросе' })
	@IsString({ message: 'Поле test_plan_id быть строкой' })
	@IsNotEmpty({ message: 'Поле test_plan_id не должно быть пустым' })
	readonly test_plan_id?: string;

	@ApiProperty({
		example: '233hs-95kkh-fv2vd-84jjs',
		description: 'test run id',
	})
	@IsOptional({ message: 'Поле test_run_id может отсутствовать в запросе' })
	@IsString({ message: 'Поле test_run_id быть строкой' })
	@IsNotEmpty({ message: 'Поле test_run_id не должно быть пустым' })
	readonly test_run_id?: string;

	@ApiProperty({
		example: '2023-01-17 12:14:01.139',
		description: 'created at date',
	})
	@IsOptional({ message: 'Поле createdAt может отсутствовать в запросе' })
	@IsDate({ message: 'Поле createdAt быть датой' })
	@IsNotEmpty({ message: 'Поле createdAt не должно быть пустым' })
	readonly createdAt?: Date

	@ApiProperty({
		example: '2023-01-17 12:14:01.139',
		description: 'updated at date',
	})
	@IsOptional({ message: 'Поле updatedAt может отсутствовать в запросе' })
	@IsDate({ message: 'Поле updatedAt быть датой' })
	@IsNotEmpty({ message: 'Поле updatedAt не должно быть пустым' })
	readonly updatedAt?: Date

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


export class FindAllCountReportsDto {

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

