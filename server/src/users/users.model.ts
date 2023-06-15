import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationsAttrs {
	username: string;
	password: string;
}

@Table({ tableName: 'Users' })
export class User extends Model<User, UserCreationsAttrs> {

	@ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id: number;

	@ApiProperty({ example: 'UserName', description: 'UserName пользователя' })
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	username: string;

	@ApiProperty({ example: '12345678', description: 'Пароль пользователя' })
	@Column({ type: DataType.STRING, allowNull: false })
	password: string;

	@ApiProperty({ example: 'user@mail.ru', description: 'email пользователя' })
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	email: string;

}