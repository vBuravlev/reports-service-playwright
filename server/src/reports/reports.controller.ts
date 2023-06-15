import type { Response } from 'express';
import { PinoLogger } from "nestjs-pino";
import { FileInterceptor } from '@nestjs/platform-express';
import {
	Body, Controller, Delete, Get, HttpCode, Param, Patch, Post,
	Put, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe,
	StreamableFile, Res, Query
} from '@nestjs/common';
import {
	ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse,
	ApiOperation, ApiResponse, ApiTags, ApiCookieAuth, ApiConsumes
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { FileValidationPipe, IdValidationPipe } from '../pipes/validate.pipe';
import { ReportsService } from './reports.service';
import { Report } from './reports.model';
import { CreateReportDto } from './dto/create.dto';
import { UpdateParamsReportDto, UpdateReportDto } from './dto/update.dto';
import { FindAllCountReportsDto, SearchReportDto } from './dto/search.dto';
import {
	INTERNAL_SERVER_ERROR, PARAMETERS_FAILED_VALIDATION,
} from '../constants/exceptions';
import { RESULTS_RETURNED } from '../constants/messages';
import { FindAllCountReportsResponse } from './types';


@UsePipes(
	new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true,
		transform: true,
	}),
)

@ApiTags('Отчеты')
@UseGuards(AuthenticatedGuard)
@ApiCookieAuth('connect.sid')
@Controller('reports')
export class ReportsController {

	constructor (
		private reportService: ReportsService,
		private readonly logger: PinoLogger
	) {
		logger.setContext(ReportsController.name);
	}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 201, type: Report })
	@ApiConsumes('multipart/form-data')
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	async create (
		@Body() dto: CreateReportDto,
		@UploadedFile(FileValidationPipe) file: Express.Multer.File
	): Promise<Report> {
		const report = await this.reportService.create(dto, file);
		return report;
	}

	@Delete('/:id')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 204, type: Report })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	async remove (@Param('id', IdValidationPipe) id: number): Promise<Report> {
		const report = await this.reportService.deleteById(id);
		return report;
	}

	@Get('/:id')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 200, type: Report })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Осуществить поиск отчетов по заданным значениям' })
	async findOne (@Param('id', IdValidationPipe) id: number): Promise<Report | null> {
		const report = await this.reportService.findById(id);
		return report;
	}

	@Post('/all')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(200)
	@ApiResponse({ status: 200, type: [Report] })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiOperation({ description: 'Получить все отчеты' })
	async findAll (): Promise<Report[]> {
		const reports = await this.reportService.findAll();
		return reports;
	}

	@Get()
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 200, type: FindAllCountReportsResponse })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiOperation({ description: 'Получить отчеты с разбиением на страницы' })
	async findAndCountAll (@Query() dto: FindAllCountReportsDto): Promise<FindAllCountReportsResponse> {
		const reports = await this.reportService.findAndCountAll(dto);
		return reports;
	}

	@Post('/search')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(200)
	@ApiResponse({ status: 200, type: FindAllCountReportsResponse })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Осуществить поиск отчетов по заданным значениям' })
	async searchReport (@Body() params: SearchReportDto): Promise<FindAllCountReportsResponse> {
		const reports = await this.reportService.findByParams(params);
		return reports;
	}

	@Put('/:id')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 200, type: Report })
	@HttpCode(200)
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	@ApiOperation({ description: 'Обновление отчета по ID' })
	async update (
		@Param('id', IdValidationPipe) id: number,
		@Body() dto: UpdateReportDto,
	): Promise<Report | null> {
		const report = await this.reportService.updateReportById(dto, id);
		return report;
	}

	@Patch('/:id')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(200)
	@ApiResponse({ status: 200, type: Report })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	async updateParamsReportById (
		@Param('id', IdValidationPipe) id: number,
		@Body() dto: UpdateParamsReportDto,
	): Promise<Report | null> {
		const report = await this.reportService.updateParamsReport(dto, id);
		return report;
	}


	@Put('/:id/files')
	@UseInterceptors(FileInterceptor('file'))
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@HttpCode(200)
	@ApiResponse({ status: 200, type: Report })
	@ApiConsumes('multipart/form-data')
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	async updateFilesReportById (
		@Param('id', IdValidationPipe) id: number,
		@UploadedFile(FileValidationPipe) file: Express.Multer.File,
	): Promise<Report | null> {
		const report = await this.reportService.updateFilesReportById(id, file);
		return report;
	}

	@Get('/:id/files')
	@ApiInternalServerErrorResponse({
		description: INTERNAL_SERVER_ERROR,
	})
	@ApiResponse({ status: 200, type: [String] })
	@ApiOkResponse({ description: RESULTS_RETURNED })
	@ApiBadRequestResponse({ description: PARAMETERS_FAILED_VALIDATION })
	async downloadReportFiles (
		@Param('id', IdValidationPipe) id: number,
		@Res({ passthrough: true }) res: Response
	): Promise<StreamableFile> {
		const { streamableFile, fileName } = await this.reportService.downloadFilesReportById(id);
		res.set({
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': `attachment; filename="${fileName}"`,
		});
		return streamableFile;
	}

}
