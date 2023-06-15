import { CleanReportsFn } from 'reports/types/interfaces';

export class CleanReportsDto {
	cleanGarbageReportsFn: CleanReportsFn;
	cleanOldReportsFn: CleanReportsFn;
}