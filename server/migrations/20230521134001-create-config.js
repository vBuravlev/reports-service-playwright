'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Configs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      cron_clearing_report: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cron_clearing_garbage: {
        allowNull: false,
        type: Sequelize.STRING
      },
      report_storage_period: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      current_config: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      is_default_config: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      is_auto_clean: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
       createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      } 
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Configs');
  }
};