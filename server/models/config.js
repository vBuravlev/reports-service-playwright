'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Config extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Config.init({
    name: DataTypes.STRING,
    cron_clearing_report: DataTypes.STRING,
    cron_clearing_garbage: DataTypes.STRING,
    report_storage_period: DataTypes.NUMBER,
    current_config: DataTypes.BOOLEAN,
    is_default_config: DataTypes.BOOLEAN,
    is_auto_clean: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Config',
  });
  return Config;
};