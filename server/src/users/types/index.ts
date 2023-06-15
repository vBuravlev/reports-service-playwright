import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';


export class AllUserRequest {

	@ApiProperty({ example: '1', description: 'ID пользователя', required: true })
	@IsNumber({}, { message: 'Должно быть целмым числом' })
	@IsNotEmpty({ message: 'Поле id не должно быть пустым' })
	readonly id: number;

	@ApiProperty({ example: 'UserName', description: 'UserName пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле username не должно быть пустым' })
	readonly username: string;

	@ApiProperty({ example: 'user@mail.ru', description: 'UserName, должен быть email', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsEmail({}, { message: "Некорректный email" })
	@IsNotEmpty({ message: 'Поле email не должно быть пустым' })
	readonly email: string;

}

export class LoginUserRequest {
	@ApiProperty({ example: 'UserName', description: 'UserName пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле username не должно быть пустым' })
	username: string;

	@ApiProperty({ example: '12345678', description: 'Пароль пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
	@IsNotEmpty({ message: 'Поле password не должно быть пустым' })
	password: string;
}


export class DeleteUserRequest {

	@ApiProperty({ example: 'UserName', description: 'UserName пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле username не должно быть пустым' })
	username: string;

	@ApiProperty({ example: '12345678', description: 'Пароль пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
	@IsNotEmpty({ message: 'Поле password не должно быть пустым' })
	password: string;
}


export class FindUserRequest {

	@ApiProperty({ example: '1', description: 'Id пользователя', required: true })
	@IsNumber({}, { message: 'Должно быть числом' })
	@IsNotEmpty({ message: 'Поле id не должно быть пустым' })
	readonly id: number;

	@ApiProperty({ example: 'UserName', description: 'UserName пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле username не должно быть пустым' })
	username: string;

	@ApiProperty({ example: '12345678', description: 'Email пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsEmail({}, { message: 'Не меньше 4 и не больше 16' })
	@IsNotEmpty({ message: 'Поле email не должно быть пустым' })
	readonly email: string;
}

export class LogoutUserResponse {
	@ApiProperty({ example: 'Logged in', description: 'Сообщение', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле msg не должно быть пустым' })
	readonly msg: string;
}

export class LoginCheckResponse {
	@ApiProperty({ example: 1, description: 'userId пользователя', required: true })
	@IsNumber({ allowNaN: false }, { message: 'Должно быть числом' })
	@Min(1, { message: 'Id не может быть меньше единицы' })
	@IsNotEmpty({ message: 'Поле userId не должно быть пустым' })
	readonly userId: number;

	@ApiProperty({ example: 'ivan', description: 'Поле username', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле username не должно быть пустым' })
	readonly username: string;

	@ApiProperty({ example: '12345678', description: 'Email пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsEmail({}, { message: 'Не меньше 4 и не больше 16' })
	@IsNotEmpty({ message: 'Поле email не должно быть пустым' })
	readonly email: string;
}

export class LoginUserResponse {
	@ApiProperty({
		example: `{ "userId": 1, "username": "admin1", "email": "admin@admin.ru" }`,
		description: 'UserName пользователя',
		required: true
	})
	@IsNotEmpty({ message: 'Поле user не должно быть пустым' })
	readonly user: LoginCheckResponse;

	@ApiProperty({ example: 'Logged in', description: 'Сообщение', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле msg не должно быть пустым' })
	readonly msg: string;

}

export class SignupResponse {
	@ApiProperty({ example: 1, description: 'ID пользователя', required: true })
	@IsNumber()
	@IsNotEmpty({ message: 'Поле password не должно быть пустым' })
	@Min(1, { message: 'Id не может быть меньше 1' })
	id: number;

	@ApiProperty({ example: 'ivan', description: 'Поле username', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@IsNotEmpty({ message: 'Поле username не должно быть пустым' })
	username: string;

	@ApiProperty({ example: '12345678', description: 'Пароль пользователя', required: true })
	@IsString({ message: 'Должно быть строкой' })
	@Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
	@IsNotEmpty({ message: 'Поле password не должно быть пустым' })
	password: string;

	@ApiProperty({ example: 'user@mail.ru', description: 'UserName, должен быть email', required: true })
	@IsEmail({}, { message: "Некорректный email" })
	@IsNotEmpty({ message: 'Поле email не должно быть пустым' })
	email: string;

	@ApiProperty({ example: '2023-03-17T17:23:33.502Z', description: 'Дата создания записи', required: true })
	@IsDateString()
	@IsNotEmpty({ message: 'Поле password не должно быть пустым' })
	updatedAt: string;

	@ApiProperty({ example: '2023-03-17T17:23:33.502Z', description: 'Дата обновления записи', required: true })
	@IsDateString()
	@IsNotEmpty({ message: 'Поле password не должно быть пустым' })
	createdAt: string;
}