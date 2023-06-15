import { PinoLogger } from 'nestjs-pino';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
	ForbiddenException, HttpException, HttpStatus, Injectable,
	NotAcceptableException, NotFoundException, UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Config } from './configs-service.model';
import { CreateConfigsServiceDto } from './dto/create.dto';
import {
	CONFIG_IS_CURRENT,
	CONFIG_IS_DEFAULT,
	CONFIG_NOT_FOUND_ERROR,
	CONFIG_SEARCH_PARAMS_NOT_VALID,
	EXCEPTION_CONFIG_SWITCH,
} from '../constants/exceptions';
import {
	SwitchCurrentConfigServiceDto,
	UpdateConfigsServiceDto,
	UpdateParamsConfigsServiceDto,
} from './dto/update.dto';
import { ConfigCleanCronEventDto } from '../tasks/dto/clean-cron.dto';
import { ConfigCronsEvent } from '../events/enum/configs.enum';
import { CronsTimeTemplates } from 'tasks/types/interfaces';
import { Cron } from '@nestjs/schedule';
import { FindAllCountConfigDto, SearchConfigsServiceDto } from './dto/seatch.dto';
import { FindAllCountConfigsResponse } from './types';

@Injectable()
export class ConfigsServiceService {

	private cronTimeTemplates: CronsTimeTemplates;

	constructor (
		@InjectModel(Config) private readonly configRepository: typeof Config,
		private readonly logger: PinoLogger,
		private readonly sequelize: Sequelize,
		private readonly eventEmitter: EventEmitter2
	) {
		logger.setContext(ConfigsServiceService.name);
	}

	@OnEvent(ConfigCronsEvent.SEND_CRON_TIME)
	setCronTimeTemplates (payload: CronsTimeTemplates) {
		this.cronTimeTemplates = payload;
	}

	getCronTimeTemplates () {
		return this.cronTimeTemplates;
	}

	@Cron(new Date(Date.now() + 5 * 1000), {
		name: 'updateCronTimes'
	})
	updateCronTimes () {
		this.eventEmitter.emit(ConfigCronsEvent.GET_CRON_TIME_UPDATE);
	}

	@OnEvent(ConfigCronsEvent.UPDATE_CRONS, { async: true })
	async updateCrons () {

		const {
			cron_clearing_garbage,
			cron_clearing_report,
			report_storage_period,
			is_auto_clean
		} = await this.getCurrentConfig();

		const configUpdateEvent: ConfigCleanCronEventDto = new ConfigCleanCronEventDto(
			cron_clearing_garbage, cron_clearing_report, report_storage_period, is_auto_clean
		);

		this.eventEmitter.emit(ConfigCronsEvent.CONFIG_UPDATE, configUpdateEvent);
	}

	async createConfig (dto: CreateConfigsServiceDto): Promise<Config> {
		const configs = await this.configRepository.findAll({
			where: {
				current_config: {
					[Op.is]: true
				}
			}
		})
		if (dto.current_config && configs.length) throw new NotFoundException(CONFIG_IS_CURRENT);
		const config = await this.configRepository.create(dto);
		return config;
	}

	async findAll (): Promise<Config[]> {
		const configs = await this.configRepository.findAll({
			include: { all: true },
			order: [
				['current_config', 'DESC'],
				['updatedAt', 'DESC']
			],
		});
		return configs;
	}

	async findAndCountAll (dto: FindAllCountConfigDto): Promise<FindAllCountConfigsResponse> {
		const { limit, offset } = dto;
		const { count, rows } = await this.configRepository.findAndCountAll({
			include: { all: true },
			order: [
				['current_config', 'DESC'],
				['updatedAt', 'DESC']
			],
			limit,
			offset
		});
		return {
			count,
			configs: rows
		};
	}


	async findById (id: number): Promise<Config> {
		const config = await this.configRepository.findByPk(id);
		if (!config) throw new NotFoundException(CONFIG_NOT_FOUND_ERROR);
		return config;
	}

	async findByParams (dto: SearchConfigsServiceDto): Promise<FindAllCountConfigsResponse> {
		try {
			if (!Object.values(dto).length) {
				throw new HttpException(CONFIG_SEARCH_PARAMS_NOT_VALID, HttpStatus.BAD_REQUEST);
			}
			const { limit, offset, ...searchParams } = dto;
			const { count, rows } = await this.configRepository.findAndCountAll({
				include: { all: true },
				where: { ...searchParams },
				order: [
					['createdAt', 'DESC']
				],
				limit,
				offset
			});
			return {
				count,
				configs: rows
			};
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(CONFIG_SEARCH_PARAMS_NOT_VALID, HttpStatus.BAD_REQUEST);
		}
	}

	async getCurrentConfig (): Promise<Config> {
		const config = await this.configRepository.findOne({
			where: {
				current_config: {
					[Op.is]: true
				}
			}
		});
		if (!config) throw new NotFoundException(CONFIG_NOT_FOUND_ERROR);
		return config;
	}

	async deleteById (id: number) {
		const config = await this.findById(id);
		if (!config) throw new NotFoundException(CONFIG_NOT_FOUND_ERROR);
		if (config.current_config) throw new ForbiddenException(CONFIG_IS_CURRENT);
		if (config.is_default_config) throw new ForbiddenException(CONFIG_IS_DEFAULT);
		await this.configRepository.destroy({ where: { id } });
		return config;
	}

	async switchCurrentConfig (dto: SwitchCurrentConfigServiceDto): Promise<Config> {
		try {
			const { id } = dto;
			await this.sequelize.transaction(async t => {
				const transactionHost = { transaction: t };
				const current_config = await this.getCurrentConfig();
				if (current_config.id === id) throw new UnprocessableEntityException(CONFIG_IS_CURRENT);

				const [numberNewConfig] = await this.configRepository.update(
					{ current_config: true }, { where: { id }, ...transactionHost }
				);
				const [numberOldConfig] = await this.configRepository.update(
					{ current_config: false }, { where: { id: current_config.id }, ...transactionHost }
				);
				if (numberNewConfig <= 0 || numberOldConfig <= 0) throw new NotAcceptableException(EXCEPTION_CONFIG_SWITCH);
			});
			this.updateCrons();
			const newCurrentConfig = await this.getCurrentConfig();
			return newCurrentConfig;
		} catch (err) {
			this.logger.error(err);
			throw new NotAcceptableException(EXCEPTION_CONFIG_SWITCH);
		}
	}

	async updateConfigById (params: UpdateConfigsServiceDto, id: number): Promise<Config> {
		try {
			const config = await this.sequelize.transaction(async t => {
				const transactionHost = { transaction: t };
				const [number] = await this.configRepository.update(params, { where: { id }, ...transactionHost });
				if (!Number.isInteger(number) && number <= 0) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
				const config = await this.configRepository.findByPk(id, { ...transactionHost });
				if (!config) throw new NotFoundException(CONFIG_NOT_FOUND_ERROR);
				return config;
			});
			this.updateCrons();
			return config;
		} catch (err) {
			this.logger.error(err);
			throw new NotFoundException(CONFIG_NOT_FOUND_ERROR);
		}
	}

	async updateParamsConfig (params: UpdateParamsConfigsServiceDto, id: number): Promise<Config> {
		try {
			const config = await this.sequelize.transaction(async t => {
				const transactionHost = { transaction: t };
				const beforeConfig = await this.configRepository.findByPk(id, { ...transactionHost });
				if (!beforeConfig) throw new NotFoundException(CONFIG_NOT_FOUND_ERROR);
				const [number] = await this.configRepository.update(params, { where: { id } });
				if (!Number.isInteger(number) && number <= 0) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
				const config = await this.configRepository.findByPk(id);
				if (!config) throw new NotFoundException(CONFIG_NOT_FOUND_ERROR);
				return config;
			});
			this.updateCrons();
			return config;
		}
		catch (err) {
			this.logger.error(err);
			throw new NotFoundException(CONFIG_NOT_FOUND_ERROR);
		}
	}

}
