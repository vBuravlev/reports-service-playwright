import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginCheckResponse } from '../users/types';
import { INCORRECT_EMAIL_OR_PASSWORD } from 'constants/exceptions';

@Injectable()
export class AuthService {

	constructor (private readonly usersService: UsersService) { }

	async validateUser (username: string, password: string): Promise<LoginCheckResponse | null> {
		const user = await this.usersService.findOne({ where: { username } });

		if (!user) {
			throw new UnauthorizedException(INCORRECT_EMAIL_OR_PASSWORD);
		}

		const passwordValid = await bcrypt.compare(password, user.password);

		if (!passwordValid) {
			throw new UnauthorizedException(INCORRECT_EMAIL_OR_PASSWORD);
		}

		if (user && passwordValid) {
			return {
				userId: user.id,
				username: user.username,
				email: user.email,
			};
		}

		return null;
	}
}