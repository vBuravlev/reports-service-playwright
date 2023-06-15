import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/createUser.dto';
import { AllUserRequest, FindUserRequest } from './types';
import {
	ERROR_ENV_SALT_NOT_FOUND, INTERNAL_SERVER_ERROR, USER_EMAIL_ALREADY_EXISTS,
	USER_NOT_FOUND_ERROR, USER_USERNAME_ALREADY_EXISTS
} from 'constants/exceptions';
import { SearchUserDto } from './dto/search.dto';


@Injectable()
export class UsersService {

	constructor (
		@InjectModel(User) private readonly userModel: typeof User,
		private configService: ConfigService,
		private readonly logger: PinoLogger,
	) { }

	async findAllUsers (): Promise<AllUserRequest[]> {
		const result = await this.userModel.findAll({
			include: { all: true },
			attributes: { include: ['id', 'username', 'email'] }
		});
		return result;
	}

	async findOne (filter: {
		where: { id?: number; username?: string; email?: string }
	}): Promise<User | null> {
		const result = await this.userModel.findOne({ ...filter });
		return result;
	}

	async findUser (dto: SearchUserDto): Promise<FindUserRequest | {}> {
		try {
			if (!Object.values(dto).length) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
			const columns = {
				include: ['id', 'username', 'email'],
				exclude: ['password', 'createdAt', 'updatedAt']
			};
			const result = await this.userModel.findOne({ where: { ...dto }, attributes: columns });
			if (!result) return {};
			return result;
		} catch (err) {
			this.logger.error(err);
			throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
		}
	}

	async deleteUserById (id: number) {
		const user = await this.findOne({ where: { id } });
		if (!user) throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
		this.userModel.destroy({ where: { id } });
		return user;
	}

	async create (
		createUserDto: CreateUserDto,
	): Promise<User | { warningMessage: string }> {
		try {
			const existingByUserName = await this.findOne({
				where: { username: createUserDto.username },
			});

			if (existingByUserName) {
				throw new HttpException(USER_USERNAME_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
			}

			const existingByEmail = await this.findOne({
				where: { email: createUserDto.email },
			});

			if (existingByEmail) {
				throw new HttpException(USER_EMAIL_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
			}

			const salt = this.configService.get<number>('CRYPT_SALT');
			if (!salt) throw new Error(ERROR_ENV_SALT_NOT_FOUND);
			const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

			const user = await this.userModel.create({ ...createUserDto, password: hashedPassword });
			return user;
		} catch (err) {
			this.logger.error(ERROR_ENV_SALT_NOT_FOUND);
			return { warningMessage: INTERNAL_SERVER_ERROR };
		}

	}

}
