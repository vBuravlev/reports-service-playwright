import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchUserDto {

	@ApiProperty({ example: '1', description: 'Id пользователя', required: true })
	@IsNumber({}, { message: 'Должно быть числом' })
	@IsNotEmpty({ message: 'Поле id не должно быть пустым' })
	@IsOptional({ message: 'Поле id может отсутствовать в запросе' })
	readonly id?: number;

	@ApiProperty({ example: 'UserName', description: 'UserName пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле username не должно быть пустым' })
	@IsOptional({ message: 'Поле username может отсутствовать в запросе' })
	readonly username?: string;

	@ApiProperty({ example: 'user@mail.ru', description: 'UserName, должен быть email', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsEmail({}, { message: "Некорректный email" })
	@IsNotEmpty({ message: 'Поле email не должно быть пустым' })
	@IsOptional({ message: 'Поле email может отсутствовать в запросе' })
	readonly email?: string;

}