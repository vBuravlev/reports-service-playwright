import {
	Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Post, Request, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiBody, ApiOkResponse, ApiCookieAuth, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import {
	AllUserRequest, DeleteUserRequest, FindUserRequest, LoginCheckResponse, LoginUserRequest, LoginUserResponse, LogoutUserResponse, SignupResponse,
} from './types';
import { LocalAuthGuard } from 'auth/guards/local.auth.guard';
import { AuthenticatedGuard } from 'auth/guards/authenticated.guard';
import { RequestPassport } from './types/interfaces';
import { User } from './users.model';
import { IdValidationPipe } from 'pipes/validate.pipe';
import { LOGGED_IN, SESSION_HAS_ENDED } from 'constants/messages';
import { INTERNAL_SERVER_ERROR, PARAMETERS_FAILED_VALIDATION } from 'constants/exceptions';
import { SearchUserDto } from './dto/search.dto';

@Controller('users')
export class UsersController {

	constructor (private readonly usersService: UsersService) { }

	@Get()
	@UseGuards(AuthenticatedGuard)
	@ApiOkResponse({ type: LoginCheckResponse })
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiCookieAuth('connect.sid')
	@Header('Content-type', 'application/json')
	async getAllUsers (): Promise<AllUserRequest[]> {
		return this.usersService.findAllUsers();
	}

	@Post('/signup')
	@UseGuards(AuthenticatedGuard)
	@HttpCode(HttpStatus.CREATED)
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiOkResponse({ type: SignupResponse })
	@ApiCookieAuth('connect.sid')
	@Header('Content-type', 'application/json')
	async createUser (@Body() createUserDto: CreateUserDto): Promise<User | { warningMessage: string }> {
		return this.usersService.create(createUserDto);
	}

	@Post('/login')
	@UseGuards(LocalAuthGuard)
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: LoginUserRequest })
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiOkResponse({ type: LoginUserResponse })
	@Header('Content-type', 'application/json')
	login (@Request() req: RequestPassport): LoginUserResponse {
		return { user: req.user, msg: LOGGED_IN };
	}


	@Get('/login-check')
	@UseGuards(AuthenticatedGuard)
	@ApiOkResponse({ type: LoginCheckResponse })
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiCookieAuth('connect.sid')
	@Header('Content-type', 'application/json')
	loginCheck (@Request() req: RequestPassport): LoginCheckResponse {
		return req.user;
	}

	@Post('/logout')
	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth('connect.sid')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: LogoutUserResponse })
	@Header('Content-type', 'application/json')
	async logout (@Request() req: RequestPassport): Promise<LogoutUserResponse> {
		req.session.destroy();
		return { msg: SESSION_HAS_ENDED };
	}

	@Delete('/:id')
	@UseGuards(AuthenticatedGuard)
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiOkResponse({ type: DeleteUserRequest })
	@HttpCode(204)
	@ApiCookieAuth('connect.sid')
	@Header('Content-type', 'application/json')
	async deleteUserById (
		@Param('id', IdValidationPipe) id: number
	): Promise<DeleteUserRequest> {
		const user = await this.usersService.deleteUserById(id);
		return user;
	}

	@Post('/search')
	@UseGuards(AuthenticatedGuard)
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiCookieAuth('connect.sid')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: 200, type: "" })
	@Header('Content-type', 'application/json')
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Осуществить поиск пользователя по заданным значениям' })
	async searchUsers (@Body() params: SearchUserDto): Promise<FindUserRequest | {}> {
		const users = await this.usersService.findUser(params);
		return users;
	}

}
