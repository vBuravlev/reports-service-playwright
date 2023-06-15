

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateReportDto {

	@ApiProperty({
		example: 'Отчет для проекта №114',
		description: 'report title',
		required: false,
	})
	@IsString({ message: 'Поле title должно быть строкой' })
	@IsNotEmpty({ message: 'Поле title не должно быть пустым' })
	readonly title: string;

	@ApiProperty({
		example: 'project-test',
		description: 'project name',
	})
	@IsString({ message: 'Поле project_name быть строкой' })
	@IsNotEmpty({ message: 'Поле project_name не должно быть пустым' })
	readonly project_name: string;

	@ApiProperty({
		example: 'false',
		description: 'deleted status of the report',
		required: false,
	})
	@IsBoolean({ message: 'Поле is_delete должно быть логическим' })
	@IsNotEmpty({ message: 'Поле is_delete не должно быть пустым' })
	readonly is_delete: boolean;


	@ApiProperty({
		example: '233hs-95kkh-fv2vd-84jjs',
		description: 'test project id',
		required: true,
	})
	@IsString({ message: 'Поле test_project_id быть строкой' })
	@IsNotEmpty({ message: 'Поле test_project_id не должно быть пустым' })
	readonly test_project_id: string;


	@ApiProperty({
		example: '233hs-95kkh-fv2vd-84jjs',
		description: 'test plan id',
		required: true,
	})
	@IsString({ message: 'Поле test_plan_id быть строкой' })
	@IsNotEmpty({ message: 'Поле test_plan_id не должно быть пустым' })
	readonly test_plan_id: string;

	@ApiProperty({
		example: '233hs-95kkh-fv2vd-84jjs',
		description: 'test run id',
		required: true,
	})
	@IsString({ message: 'Поле test_run_id быть строкой' })
	@IsNotEmpty({ message: 'Поле test_run_id не должно быть пустым' })
	readonly test_run_id: string;

}


export class UpdateParamsReportDto {

	@ApiProperty({
		example: 'Отчет для проекта №114',
		description: 'report title',
	})
	@IsOptional({ message: 'Поле title может отсутствовать в запросе' })
	@IsString({ message: 'Поле title должно быть строкой' })
	@IsNotEmpty({ message: 'Поле title не должно быть пустым' })
	title?: string;

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
		example: '233hs-95kkh-fv2vd-84jjs',
		description: 'путь к файлам отчета',
	})
	@IsOptional({ message: 'Поле path_report может отсутствовать в запросе' })
	@IsString({ message: 'Поле path_report быть строкой' })
	@IsNotEmpty({ message: 'Поле path_report не должно быть пустым' })
	path_report?: string;

	@ApiProperty({
		example: 'false',
		description: 'deleted status of the report',
	})
	@IsOptional({ message: 'Поле is_delete может отсутствовать в запросе' })
	@IsBoolean({ message: 'Поле is_delete должно быть логическим' })
	@IsNotEmpty({ message: 'Поле is_delete не должно быть пустым' })
	is_delete?: boolean;

}