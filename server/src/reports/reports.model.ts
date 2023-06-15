import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ReportCreationsAttrs {
	title: string;
	test_project_id: string;
	test_plan_id: string;
	test_run_id: string;
	path_report: string;
}

@Table({ tableName: 'Reports' })
export class Report extends Model<Report, ReportCreationsAttrs> {

	@ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id: number;

	@ApiProperty({ example: 'Отчет автотестирования №1', description: 'Название отчета' })
	@Column({ type: DataType.STRING, allowNull: false })
	title: string;

	@ApiProperty({ example: 'project-test', description: 'Название проекта' })
	@Column({ type: DataType.STRING, allowNull: true })
	project_name: string;

	@ApiProperty({ example: '4f8ad46f-0945-4a52-955e-64f23d661cb3', description: 'Id проекта' })
	@Column({ type: DataType.STRING, allowNull: true })
	test_project_id: string;

	@ApiProperty({ example: '4f8ad46f-0945-4a52-955e-64f23d661cb3', description: 'Id тест-плана' })
	@Column({ type: DataType.STRING, allowNull: false })
	test_plan_id: string;

	@ApiProperty({ example: '4f8ad46f-0945-4a52-955e-64f23d661cb3', description: 'Id тест-рана' })
	@Column({ type: DataType.STRING, allowNull: false })
	test_run_id: string;

	@ApiProperty({ example: '/reports/124124124124', description: 'Путь до директории с отчетами' })
	@Column({ type: DataType.STRING, allowNull: false })
	path_report: string;

	@ApiProperty({ example: 'false', description: 'Статус удаления' })
	@Column({ type: DataType.BOOLEAN, defaultValue: true, allowNull: true })
	is_delete: boolean;

}