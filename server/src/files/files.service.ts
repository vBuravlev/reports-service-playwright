import fsp from 'node:fs/promises';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import path from 'node:path';
import tar from 'tar';
import { pipeline } from 'node:stream/promises';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from "nestjs-pino";
import { HttpException, HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { SaveArchiveFileDto } from './dto/saveArchiveFile.dto';
import { EXCEPTION_CREATE_ARCHIVE, EXCEPTION_CREATE_DIR, EXCEPTION_MOVE_FILE, EXCEPTION_READ_DIR, EXCEPTION_REMOVE_DIR, EXCEPTION_SAVE_FILE, EXCEPTION_UNPACKING_ARCHIVE } from 'constants/exceptions';
import { RenameFiles, ReportsPaths, StreamableFileCustomExtends } from './types/interfaces';
import { ArchivePaths } from './types/types';
import { FileExtension } from './enum/file-extension.enum';
import { PathStorage } from './enum/paths.enum';
import { FilesEvent } from '../events/enum/files.enum';

@Injectable()
export class FilesService {

	public readonly reportsStorage: string = path.resolve(__dirname, `../../../files-storage/${PathStorage.REPORTS_STORAGE}`);
	public readonly archiveStorage: string = path.resolve(__dirname, `../../../files-storage/${PathStorage.ARCHIVE_STORAGE}`);
	private readonly tempName = `-temp`;

	constructor (
		private readonly logger: PinoLogger,
		private readonly eventEmitter: EventEmitter2
	) {
		logger.setContext(FilesService.name);
	}

	fileNameTarCreator (outputTarFilePath: string) {
		return `${outputTarFilePath.split(path.sep).pop()}.${FileExtension.TAR}`;
	}

	extractFilesNames (paths: string[]): string[] {
		const pathsBase = paths.map((item: string) => path.parse(item).base);
		return pathsBase;
	}

	async createDir (dirPath: string): Promise<void> {
		const exists = !!(await fsp.access(dirPath).then(() => true, () => false));
		if (!exists) await fsp.mkdir(dirPath, { recursive: true });
	}

	async writeFilePipeline (outputFilePath: string, buffer: Buffer) {
		await pipeline(
			Readable.from(buffer),
			fs.createWriteStream(outputFilePath, { flags: 'w+', encoding: 'utf-8' })
		);
	}

	async createTarFile (outputTarFilePath: string, inputDirPath: string): Promise<string> {
		try {
			const files = await this.getFilesNames(inputDirPath);
			const write = fs.createWriteStream(outputTarFilePath);
			await pipeline(
				tar.c({ gzip: true }, files),
				write
			);
			const fileName = this.fileNameTarCreator(outputTarFilePath);
			const tarFilePath = path.join(outputTarFilePath, fileName);
			return tarFilePath;
		} catch (err) {
			this.logger.error(err);
			throw new Error(EXCEPTION_CREATE_ARCHIVE);
		}
	}

	/*
	* файл приходит внутри с упакованной директориb
	*/
	async extractTarFile (inputTarFilePath: string, outputDirPath: string): Promise<string> {
		try {
			const read = fs.createReadStream(inputTarFilePath);
			await pipeline(
				read,
				tar.x({ strip: 1, C: outputDirPath })
			);
			const files = await this.getFilesNames(outputDirPath);
			if (!files.length) throw new Error(EXCEPTION_UNPACKING_ARCHIVE);

			//TODO временное поведение из-за вложенной директории
			for (const file of files) {
				const filePath = path.join(outputDirPath, file);
				const stats = await fsp.stat(filePath);
				if (stats.isDirectory()) return file;
			}
			throw new Error(EXCEPTION_UNPACKING_ARCHIVE);
		} catch (err) {
			this.logger.error(err);
			throw new Error(EXCEPTION_UNPACKING_ARCHIVE);
		}
	}

	async createUniqueDirInArchiveStorage (uniqueName: string): Promise<string> {
		try {
			const dirArchivePath = path.join(this.archiveStorage, uniqueName);
			await this.createDir(dirArchivePath);
			return dirArchivePath;
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_CREATE_DIR, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async createUniqueDirInReportStorage (uniqueName: string): Promise<string> {
		try {
			const dirSavePath = path.join(this.reportsStorage, uniqueName);
			await this.createDir(dirSavePath);
			return dirSavePath;
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_CREATE_DIR, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getFilesNames (dirPath: string): Promise<string[]> {
		try {
			const files = await fsp.readdir(dirPath);
			return files;
		} catch (err) {
			this.logger.error(err);
			throw new Error(EXCEPTION_READ_DIR);
		}
	}

	async moveFile (oldPath: string, newPath: string): Promise<void> {
		try {
			await fsp.rename(oldPath, newPath);
		} catch (err) {
			this.logger.error(err);
			throw new Error(EXCEPTION_MOVE_FILE);
		}
	}

	async deletedDir (dirPath: string): Promise<void> {
		try {
			const exists = !!(await fsp.stat(dirPath).then(() => true, () => false));
			if (exists) await fsp.rm(dirPath, { recursive: true, maxRetries: 2 });
		} catch (err) {
			throw new Error(EXCEPTION_REMOVE_DIR);
		}
	}

	async deleteFile (filePath: string): Promise<void> {
		try {
			await fsp.unlink(filePath);
		} catch (err) {
			this.logger.error(err);
			throw new Error(EXCEPTION_MOVE_FILE);
		}
	}

	/*
	 * Reports domain
	 */

	getReportPaths (uniqueNamePathReport: string): ReportsPaths {
		const archiveStorageULID: string = path.join(this.archiveStorage, uniqueNamePathReport);
		const reportStorageULID: string = path.join(this.reportsStorage, uniqueNamePathReport);
		return {
			archiveStorageULID,
			reportStorageULID
		}
	}

	async getFilesNamesReport (uniqueNamePathReport: string): Promise<string[]> {
		const { reportStorageULID } = this.getReportPaths(uniqueNamePathReport);
		const files = await this.getFilesNames(reportStorageULID);
		return files;
	}

	async moveFiles (inputDirPath: string, outputDirPath: string): Promise<void> {
		try {
			const filesReport = await this.getFilesNames(inputDirPath);
			for (const fileReport of filesReport) {

				const itemArchivePath = path.join(inputDirPath, fileReport);
				const itemSavePath = path.join(outputDirPath, fileReport);
				const stat = await fsp.stat(itemArchivePath);
				if (stat.isFile()) {
					const newSaveDirPath = path.parse(itemSavePath);
					if (newSaveDirPath) await this.createDir(newSaveDirPath.dir)
				}
				const exists = !!(await fsp.access(itemSavePath).then(() => true, () => false));
				if (!exists) await this.moveFile(itemArchivePath, itemSavePath);
			}

		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_MOVE_FILE, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async downloadFilesReportByPath (pathReport: string): Promise<StreamableFileCustomExtends> {
		try {
			const { archiveStorageULID } = await this.getReportPaths(pathReport);
			const fileName = this.fileNameTarCreator(archiveStorageULID);
			const filePath = path.join(archiveStorageULID, fileName);
			const file = fs.createReadStream(filePath);
			return {
				streamableFile: new StreamableFile(file),
				fileName
			}
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_SAVE_FILE, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async saveReportArchiveInArchive ({ file, name, filExtension }: SaveArchiveFileDto): Promise<ArchivePaths> {
		try {
			const fileName = `${name}.${filExtension}`;
			const dirUniqueNameArchivePath = await this.createUniqueDirInArchiveStorage(name);
			const fileArchivePath = path.join(dirUniqueNameArchivePath, fileName);
			await this.writeFilePipeline(fileArchivePath, file.buffer);
			return {
				dirUniqueNameArchivePath,
				fileArchivePath
			};
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_SAVE_FILE, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@OnEvent(FilesEvent.SAVE_REPORT, { async: true })
	async extractAndMoveReport (payload: ArchivePaths) {
		try {
			const { fileArchivePath, dirUniqueNameArchivePath } = payload;
			const tempExtractDir = await this.extractTarFile(fileArchivePath, dirUniqueNameArchivePath);
			const uniqueName = `${dirUniqueNameArchivePath.split(path.sep).pop()}`;
			const dirSavePathReportStorage = await this.createUniqueDirInReportStorage(uniqueName);
			const tempFilesPath = path.join(dirUniqueNameArchivePath, tempExtractDir);
			await this.moveFiles(tempFilesPath, dirSavePathReportStorage);
			console.log("tempFilesPath", tempFilesPath)
			/* 	this.eventEmitter.emit(FilesEvent.SAVE_REPORT, {
					dirUniqueNameArchivePath, fileArchivePath
				}); */
			await this.deletedDir(tempFilesPath);
		} catch (err) {
			throw new HttpException(EXCEPTION_SAVE_FILE, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async saveFileReport ({ file, name, filExtension }: SaveArchiveFileDto): Promise<string> {
		try {
			const { dirUniqueNameArchivePath, fileArchivePath } = await this.saveReportArchiveInArchive({ file, name, filExtension });
			this.eventEmitter.emit(FilesEvent.SAVE_REPORT, {
				dirUniqueNameArchivePath, fileArchivePath
			});
			return name;
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_SAVE_FILE, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@OnEvent(FilesEvent.DELETE_REPORT_AFTER_UPDATE)
	async deleteDirs (event: RenameFiles) {
		try {
			const { dirSavePathReportStorageArchiveName, dirUniqueNamePathArchiveName } = event;
			await Promise.all([
				this.deletedDir(dirSavePathReportStorageArchiveName),
				this.deletedDir(dirUniqueNamePathArchiveName)
			]);
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_REMOVE_DIR, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateFileReport ({ file, name, filExtension }: SaveArchiveFileDto): Promise<RenameFiles> {
		try {

			const storageFlow = async () => {
				const dirSavePathReportStorage = await this.createUniqueDirInReportStorage(name);
				const dirSavePathReportStorageArchiveName = `${dirSavePathReportStorage}${this.tempName}`;
				await this.moveFiles(dirSavePathReportStorage, dirSavePathReportStorageArchiveName);
				return dirSavePathReportStorageArchiveName;
			}

			const tempFlow = async () => {
				const dirUniqueNamePathArchive = await this.createUniqueDirInArchiveStorage(name);
				const dirUniqueNamePathArchiveName = `${dirUniqueNamePathArchive}${this.tempName}`;
				await this.moveFiles(dirUniqueNamePathArchive, dirUniqueNamePathArchiveName);
				return dirUniqueNamePathArchiveName;
			}

			const [dirSavePathReportStorageArchiveName, dirUniqueNamePathArchiveName] = await Promise.all([
				storageFlow(), tempFlow()
			]);
			const { dirUniqueNameArchivePath, fileArchivePath } = await this.saveReportArchiveInArchive({ file, name, filExtension });
			this.eventEmitter.emit(FilesEvent.SAVE_REPORT, {
				dirUniqueNameArchivePath, fileArchivePath
			});

			return {
				dirSavePathReportStorageArchiveName,
				dirUniqueNamePathArchiveName
			};
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_SAVE_FILE, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



	async rollBackUpdate ({
		dirSavePathReportStorageArchiveName,
		dirUniqueNamePathArchiveName
	}: RenameFiles) {
		try {
			const renameFilesUniqueName: RenameFiles = {
				dirSavePathReportStorageArchiveName: dirSavePathReportStorageArchiveName.replace(this.tempName, ""),
				dirUniqueNamePathArchiveName: dirUniqueNamePathArchiveName.replace(this.tempName, "")
			}

			await this.deleteDirs(renameFilesUniqueName);

			const storageFlow = async () => {
				const dirSavePathReportStorage = await this.createUniqueDirInReportStorage(renameFilesUniqueName.dirSavePathReportStorageArchiveName);
				await this.moveFiles(dirSavePathReportStorageArchiveName, dirSavePathReportStorage);
				return dirSavePathReportStorageArchiveName;
			}

			const tempFlow = async () => {
				const dirUniqueNamePathArchive = await this.createUniqueDirInArchiveStorage(renameFilesUniqueName.dirUniqueNamePathArchiveName);
				await this.moveFiles(dirUniqueNamePathArchiveName, dirUniqueNamePathArchive);
				return dirUniqueNamePathArchiveName;
			}
			await Promise.all([storageFlow(), tempFlow()]);
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_SAVE_FILE, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	async removeReportFiles (uniqueNamePathReport: string) {
		try {
			const { archiveStorageULID, reportStorageULID } = this.getReportPaths(uniqueNamePathReport);
			await Promise.all([
				this.deletedDir(archiveStorageULID),
				this.deletedDir(reportStorageULID)
			]);
		} catch (err) {
			this.logger.error(err);
			throw new HttpException(EXCEPTION_REMOVE_DIR, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}