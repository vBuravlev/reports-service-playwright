import {
	Body, Controller, Delete, Get, HttpCode, Param, Patch, Post,
	Put, Query, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import {
	ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse,
	ApiOperation, ApiResponse, ApiTags, ApiCookieAuth
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { IdValidationPipe } from '../pipes/validate.pipe';
import {
	INTERNAL_SERVER_ERROR, PARAMETERS_FAILED_VALIDATION,
} from '../constants/exceptions';
import { RESULTS_RETURNED } from '../constants/messages';
import { PinoLogger } from "nestjs-pino";
import { Config } from './configs-service.model';
import { SwitchCurrentConfigServiceDto, UpdateConfigsServiceDto, UpdateParamsConfigsServiceDto } from './dto/update.dto';
import { CreateConfigsServiceDto } from './dto/create.dto';
import { ConfigsServiceService } from './configs-service.service';
import { CronTime } from 'cron';
import { CronsTimeTemplates } from 'tasks/types/interfaces';
import { FindAllCountConfigDto, SearchConfigsServiceDto } from './dto/seatch.dto';
import { FindAllCountConfigsResponse } from './types';

@UsePipes(
	new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true,
		transform: true,
	}),
)

@ApiTags('Конфиг сервиса')
@UsePipes(new ValidationPipe())
@UseGuards(AuthenticatedGuard)
@ApiCookieAuth('connect.sid')
@Controller('configs')
export class ConfigsServiceController {

	constructor (
		private configsService: ConfigsServiceService,
		private readonly logger: PinoLogger,
	) {
		logger.setContext(ConfigsServiceController.name);
	}


	@Post()
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 201, type: Config })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Удалить конфиг по ID' })
	async create (@Body() dto: CreateConfigsServiceDto) {
		const configService = await this.configsService.createConfig(dto);
		return configService;
	}

	@Get()
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 200, type: [Config] })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiOperation({ description: 'Получить все конфиги с заявленным лимитом и сдвигом' })
	async findAndCountAll (@Query() dto: FindAllCountConfigDto): Promise<FindAllCountConfigsResponse> {
		const config = await this.configsService.findAndCountAll(dto);
		return config;
	}

	@Post('/all')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(200)
	@ApiResponse({ status: 200, type: [Config] })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiOperation({ description: 'Получить все конфиги' })
	async findAll (): Promise<Config[]> {
		const config = await this.configsService.findAll();
		return config;
	}

	@Get('/:id')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 200, type: Config })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiOperation({ description: 'Получить конфиг по ID' })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	async findOne (@Param('id', IdValidationPipe) id: number): Promise<Config> {
		const config = await this.configsService.findById(id);
		return config;
	}

	@Post('/current-config')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 200, type: Config })

	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiOperation({ description: 'Получить текущий конфиг' })
	async getCurrentConfig (): Promise<Config> {
		const config = await this.configsService.getCurrentConfig();
		return config;
	}

	@Post('/crons-time')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(200)
	@ApiResponse({ status: 200, type: Config })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiOperation({ description: 'Получить варианты настройки времени для крона' })
	getCronTimeTemplates (): CronsTimeTemplates {
		const cronsTimeTemplates = this.configsService.getCronTimeTemplates();
		return cronsTimeTemplates;
	}

	@Patch('/switch-config')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 200, type: Config })
	@HttpCode(200)
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Переключить текущий конфиг по ID' })
	async switchCurrentConfig (@Body() dto: SwitchCurrentConfigServiceDto) {
		const config = await this.configsService.switchCurrentConfig(dto);
		return config;
	}

	@Put('/:id')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 200, type: Config })
	@HttpCode(200)
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Обновить конфиг по ID' })
	async update (
		@Param('id', IdValidationPipe) id: number,
		@Body() dto: UpdateConfigsServiceDto
	): Promise<Config> {
		const config = await this.configsService.updateConfigById(dto, id);
		return config;
	}


	@Patch('/:id')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(200)
	@ApiResponse({ status: 200, type: Config })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Обновить параметры конфига по ID' })
	async updateParamsReportById (
		@Param('id', IdValidationPipe) id: number,
		@Body() dto: UpdateParamsConfigsServiceDto,
	): Promise<Config> {
		const report = await this.configsService.updateParamsConfig(dto, id);
		return report;
	}


	@Delete('/:id')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(204)
	@ApiResponse({ status: 204, type: Config })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Удалить конфиг по ID' })
	async remove (@Param('id', IdValidationPipe) id: number) {
		const config = await this.configsService.deleteById(id);
		return config;
	}


	@Post('/search')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(200)
	@ApiResponse({ status: 200, type: FindAllCountConfigsResponse })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Осуществить поиск конфигов по заданным значениям' })
	async searchReport (@Body() params: SearchConfigsServiceDto): Promise<FindAllCountConfigsResponse> {
		const configs = await this.configsService.findByParams(params);
		return configs;
	}

}
