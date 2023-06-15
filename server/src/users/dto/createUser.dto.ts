import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';


export class CreateUserDto {

	@ApiProperty({ example: 'UserName', description: 'UserName пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле username не должно быть пустым' })
	readonly username: string;

	@ApiProperty({ example: 'user@mail.ru', description: 'UserName, должен быть email', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsEmail({}, { message: "Некорректный email" })
	@IsNotEmpty({ message: 'Поле email не должно быть пустым' })
	readonly email: string;


	@ApiProperty({ example: '12345678', description: 'Пароль пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
	@IsNotEmpty({ message: 'Поле password не должно быть пустым' })
	readonly password: string;

}