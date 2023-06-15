'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');

const hash = async (password) => {
  const salt = Number(process.env.CRYPT_SALT);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
          username: process.env.ADMIN_USERNAME,
          password: await hash(process.env.ADMIN_PASSWORD),
          email: process.env.ADMIN_EMAIL,
          createdAt: new Date(),
          updatedAt: new Date() 
        }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
