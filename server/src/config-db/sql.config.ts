import { registerAs } from '@nestjs/config';
import { Dialect } from 'sequelize';

export const sqlConfig = registerAs('database', () => ({
	dialect: <Dialect>process.env.DB__SQL_DIALECT,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	autoLoadEntities: true,
	synchronize: true,
	logging: process.env.DB_SQL_LOGGING === 'true' ? true : false,
}));
