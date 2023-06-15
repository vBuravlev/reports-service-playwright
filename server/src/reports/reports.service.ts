import { ulid } from 'ulid'
import { Op } from 'sequelize';
import { PinoLogger } from "nestjs-pino";
import { Sequelize } from 'sequelize-typescript';
import { OnEvent } from '@nestjs/event-emitter';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Report } from './reports.model';
import { FilesService } from '../files/files.service';
import { UpdateParamsReportDto, UpdateReportDto } from './dto/update.dto';
import { CreateReportDto, SaveArchiveFileDto } from './dto/create.dto';
import { FindAllCountReportsDto, SearchReportDto, } from './dto/search.dto';
import { EXCEPTION_CRON, REPORTS_SEARCH_PARAMS_NOT_VALID, REPORT_NOT_FOUND_ERROR } from '../constants/exceptions';
import { RenameFiles, StreamableFileCustomExtends } from 'files/types/interfaces';
import { FileExtension } from '../files/enum/file-extension.enum';
import { ReportsEnum } from 'events/enum/reports.enum';
import { FindAllCountReportsResponse } from './types';


@Injectable()
export class ReportsService {

	constructor (
		@InjectModel(Report) private readonly reportRepository: typeof Report,
		private readonly fileService: FilesService,
		private readonly sequelize: Sequelize,
		private readonly logger: PinoLogger,
	) {
		logger.setContext(ReportsService.name);
	}

	async create (dto: CreateReportDto, file: Express.Multer.File): Promise<Report> {
		const name: string = ulid(Date.now());
		const fileToSave: SaveArchiveFileDto = { file, name, filExtension: FileExtension.TAR };
		const path_report = await this.fileService.saveFileReport(fileToSave);
		const report = await this.reportRepository.create({ ...dto, path_report });
		if (!report) throw new NotFoundException(REPORT_NOT_FOUND_ERROR);
		return report;
	}


	async findAll (): Promise<Report[]> {
		const report = await this.reportRepository.findAll({
			include: { all: true },
			order: [
				['createdAt', 'DESC']
			]
		});
		return report;
	}

	async findAndCountAll (dto: FindAllCountReportsDto): Promise<FindAllCountReportsResponse> {
		const { limit, offset } = dto;
		const { count, rows } = await this.reportRepository.findAndCountAll({
			include: { all: true },
			order: [
				['createdAt', 'DESC']
			],
			offset,
			limit
		});
		return {
			count,
			reports: rows
		};
	}


	async findById (id: number): Promise<Report> {
		const report = await this.reportRepository.findByPk(id);
		if (!report) throw new NotFoundException(REPORT_NOT_FOUND_ERROR);
		return report;
	}

	async deleteById (id: number) {
		const report = await this.findById(id);
		if (!report) throw new NotFoundException(REPORT_NOT_FOUND_ERROR);
		await this.reportRepository.destroy({ where: { id } });
		await this.fileService.removeReportFiles(report.path_report);
		return report;
	}

	async findByParams (dto: SearchReportDto): Promise<FindAllCountReportsResponse> {
		try {
			if (!Object.values(dto).length) {
				throw new HttpException(REPORTS_SEARCH_PARAMS_NOT_VALID, HttpStatus.BAD_REQUEST);
			}
			const { limit, offset, ...searchParams } = dto;
			const { count, rows } = await this.reportRepository.findAndCountAll({
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
				reports: rows
			};
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(REPORTS_SEARCH_PARAMS_NOT_VALID, HttpStatus.BAD_REQUEST);
		}
	}

	async updateReportById (params: UpdateReportDto, id: number): Promise<Report> {
		try {
			const report = await this.sequelize.transaction(async t => {
				const transactionHost = { transaction: t };
				await this.reportRepository.update(params, { where: { id }, ...transactionHost });
				const report = await this.reportRepository.findByPk(id, { ...transactionHost });
				return report;
			});
			if (!report) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
			return report;
		} catch (err) {
			this.logger.error(err);
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}
	}

	async updateParamsReport (params: UpdateParamsReportDto, id: number): Promise<Report> {
		try {
			const report = await this.sequelize.transaction(async t => {
				const transactionHost = { transaction: t };
				await this.reportRepository.update(params, { where: { id }, ...transactionHost });
				const report = await this.reportRepository.findByPk(id, { ...transactionHost });
				return report;
			});
			if (!report) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
			return report;
		} catch (err) {
			this.logger.error(err);
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}
	}

	async updateFilesReportById (id: number, file: Express.Multer.File): Promise<Report | null> {
		let renameDirsPaths: RenameFiles = {
			dirSavePathReportStorageArchiveName: "",
			dirUniqueNamePathArchiveName: ""
		};
		let isDelete = false;
		try {
			const report = await this.sequelize.transaction(async t => {
				const transactionHost = { transaction: t };
				const report = await this.reportRepository.findByPk(id, { ...transactionHost });
				if (!report) throw new NotFoundException(REPORT_NOT_FOUND_ERROR);
				const dto: UpdateParamsReportDto = { path_report: report!.path_report };
				await this.reportRepository.update(dto, { where: { id }, ...transactionHost });
				const newReport = await this.reportRepository.findByPk(id, { ...transactionHost });
				const renameDirs = await this.fileService.updateFileReport({ file, name: report!.path_report, filExtension: FileExtension.TAR });
				renameDirsPaths = renameDirs;
				return newReport;
			});
			isDelete = true;
			await this.fileService.deleteDirs(renameDirsPaths);
			if (!report) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
			return report;
		} catch (err) {
			this.logger.error(err);
			if (isDelete) await this.fileService.rollBackUpdate(renameDirsPaths);
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}
	}

	async downloadFilesReportById (id: number): Promise<StreamableFileCustomExtends> {
		try {
			const report = await this.findById(id);
			if (!report) throw new NotFoundException(REPORT_NOT_FOUND_ERROR);
			const streamableFileWithFileName = await this.fileService.downloadFilesReportByPath(report!.path_report);
			return streamableFileWithFileName;
		} catch (err) {
			this.logger.error(err);
			throw new NotFoundException(REPORT_NOT_FOUND_ERROR);
		}

	}

	async getFilesNamesReportById (id: number): Promise<string[] | null> {
		try {
			const report = await this.findById(id);
			if (!report) throw new NotFoundException(REPORT_NOT_FOUND_ERROR);
			const filesNames = await this.fileService.getFilesNamesReport(report.path_report);
			if (filesNames && filesNames.length <= 0) return null;
			return filesNames;
		} catch (err) {
			this.logger.error(err);
			throw new NotFoundException(REPORT_NOT_FOUND_ERROR);
		}

	}


	@OnEvent(ReportsEnum.CLEAN_REPORTS_OLD, { async: true })
	async cleanOldReports (rangeDateMs: number): Promise<void> {

		const reports = await this.reportRepository.findAll({
			attributes: ['path_report'],
			where: {
				[Op.and]: [
					{ is_delete: { [Op.eq]: true } },
					{ updatedAt: { [Op.lt]: new Date(Date.now() - rangeDateMs) } }
				]
			}
		});
		if (reports.length) {
			await this.reportRepository.destroy({
				where: {
					[Op.and]: [
						{ is_delete: { [Op.eq]: true } },
						{ updatedAt: { [Op.lt]: new Date(Date.now() - rangeDateMs) } }
					]
				}
			});

			await Promise.all([
				reports.map(report => this.fileService.removeReportFiles(report.path_report))
			])
		};
	}

	async cleanReportStorage (reportsStorageFiles: string[]): Promise<void> {
		const reportsStorage = await this.reportRepository.findAll({
			attributes: ['path_report'],
			where: { path_report: { [Op.in]: reportsStorageFiles } }
		});

		const reportsStorageObj: { [key: string]: string } = reportsStorage.reduce((accumulator, value) => {
			return { ...accumulator, [value.path_report]: value.path_report };
		}, {});

		for (const reportsStorageFile of reportsStorageFiles) {
			if (reportsStorageObj[reportsStorageFile]) continue;

			const filePath = await this.fileService.createUniqueDirInReportStorage(reportsStorageFile);
			await this.fileService.deletedDir(filePath);
		}
		this.logger.info(`CleanReportStorage ${reportsStorageFiles}`);
	}

	async cleanReportArchive (tempFiles: string[]): Promise<void> {
		const reportsArchive = await this.reportRepository.findAll({
			attributes: ['path_report'],
			where: { path_report: { [Op.in]: tempFiles } }
		});

		const reportsArchiveObj: { [key: string]: string } = reportsArchive.reduce((accumulator, value) => {
			return { ...accumulator, [value.path_report]: value.path_report };
		}, {});

		for (const tempFile of tempFiles) {
			if (reportsArchiveObj[tempFile]) continue;
			const filePath = await this.fileService.createUniqueDirInArchiveStorage(tempFile);
			await this.fileService.deletedDir(filePath);
		}
		this.logger.info(`cleanReportArchive ${tempFiles}`);
	}

	@OnEvent(ReportsEnum.CLEAN_REPORTS_GARBAGE, { async: true })
	async cleanGarbageReports (): Promise<void> {
		try {
			const [tempFiles, reportsStorageFiles]: string[][] = await Promise.all([
				this.fileService.getFilesNames(this.fileService.archiveStorage),
				this.fileService.getFilesNames(this.fileService.reportsStorage)
			]);
			if (reportsStorageFiles.length) await this.cleanReportStorage(reportsStorageFiles);
			if (tempFiles.length) await this.cleanReportArchive(tempFiles);
		} catch (err) {
			this.logger.error(err);
			throw new Error(EXCEPTION_CRON);
		}
	}
}




