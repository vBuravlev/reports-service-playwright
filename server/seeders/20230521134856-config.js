'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Configs', [{
      name: 'DefaultConfig',
      cron_clearing_report: '0 0-23/12 * * *',
      cron_clearing_garbage: '0 0-23/12 * * *',
      report_storage_period: 604800000,
      current_config: true,
      is_default_config: true,
      is_auto_clean: true,
      createdAt: new Date(),
      updatedAt: new Date() 
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Configs', null, {});
  }
};
