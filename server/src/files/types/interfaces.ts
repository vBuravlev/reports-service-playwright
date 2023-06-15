import { StreamableFile } from '@nestjs/common';

export interface StreamableFileCustomExtends {
	streamableFile: StreamableFile;
	fileName?: string;
}

export interface ReportsPaths {
	archiveStorageULID: string,
	reportStorageULID: string
}

export interface RenameFiles {
	dirSavePathReportStorageArchiveName: string,
	dirUniqueNamePathArchiveName: string
}