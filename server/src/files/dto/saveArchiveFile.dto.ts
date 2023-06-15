
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FileExtension } from 'files/enum/file-extension.enum';

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