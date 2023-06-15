import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ConfigServiceCreationsAttrs {
	name: string;
	cron_clearing_report: string;
	cron_clearing_garbage: string;
	report_storage_period: number;
	current_config: boolean;
	is_default_config: boolean;
}

@Table({ tableName: 'Configs' })
export class Config extends Model<Config, ConfigServiceCreationsAttrs> {

	@ApiProperty({
		example: 1,
		description: 'Уникальный идентификатор',
		required: true
	})
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id: number;

	@ApiProperty({
		example: 'DefaultConfig',
		description: 'Название конфига',
		required: true
	})
	@Column({ type: DataType.STRING, allowNull: false })
	name: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки устаревших отчетов',
		required: true
	})
	@Column({ type: DataType.STRING, defaultValue: '0 0-23/1 * * *', allowNull: false })
	cron_clearing_report: string;

	@ApiProperty({
		example: '0 0-23/1 * * *',
		description: 'Периодичность запуска крона для очистки мусора в директориях с отчетами',
		required: true
	})
	@Column({ type: DataType.STRING, defaultValue: '0 0-23/1 * * *', allowNull: false })
	cron_clearing_garbage: string;

	@ApiProperty({
		example: '1209600000',
		description: 'Период хранения отчетов в мс',
		required: true
	})
	@Column({ type: DataType.INTEGER, defaultValue: 1209600000, allowNull: false })
	report_storage_period: number;

	@ApiProperty({
		example: true,
		description: 'Статус "Текущий конфиг"',
		required: true
	})
	@Column({ type: DataType.BOOLEAN, defaultValue: false, allowNull: false })
	current_config: boolean;

	@ApiProperty({
		example: false,
		description: 'Статус "Стандартный конфиг"',
		required: true
	})
	@Column({ type: DataType.BOOLEAN, defaultValue: false, allowNull: false })
	is_default_config: boolean;

	@ApiProperty({
		example: true,
		description: 'Автоматическая работа конфига в части очистки отчетов',
		required: true
	})
	@Column({ type: DataType.BOOLEAN, defaultValue: true, allowNull: false })
	is_auto_clean: boolean

}