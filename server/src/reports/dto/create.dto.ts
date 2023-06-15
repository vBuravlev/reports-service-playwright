
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FileExtension } from 'files/enum/file-extension.enum';

export class CreateReportDto {

	@ApiProperty({
		example: 'Отчет для проекта №114',
		description: 'title report',
		required: true,
	})
	@IsString({ message: 'Поле title быть строкой' })
	@IsNotEmpty({ message: 'Поле title не должно быть пустым' })
	readonly title: string;

	@ApiProperty({
		example: 'project-test',
		description: 'project name',
		required: true,
	})
	@IsString({ message: 'Поле project_name быть строкой' })
	@IsNotEmpty({ message: 'Поле project_name не должно быть пустым' })
	readonly project_name: string;


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


export class SaveArchiveFileDto {

	@ApiProperty({
		description: 'file *.tar archive, it is necessary to archive all report data',
		required: true,
	})
	@IsNotEmpty({ message: 'Файл не должно быть пустым' })
	readonly file: Express.Multer.File;

	@ApiProperty({
		example: '233hs-95kkh-fv2vd-84jjs',
		description: 'unique name (ulid)',
		required: true,
	})
	@IsString({ message: 'Поле name быть строкой' })
	@IsNotEmpty({ message: 'Поле name не должно быть пустым' })
	readonly name: string;

	@ApiProperty({
		example: 'tar',
		description: 'extend file (default "tar")',
		required: true,
	})
	@IsString({ message: 'Поле type быть строкой' })
	@IsNotEmpty({ message: 'Поле type не должно быть пустым' })
	readonly filExtension: FileExtension;
}