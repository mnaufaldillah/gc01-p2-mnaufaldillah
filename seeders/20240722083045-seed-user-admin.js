'use strict';
const fs = require(`fs`).promises;
const { hashPassword } = require(`../helpers/bcrypt.js`);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let data = await fs.readFile(`./data/user.json`, `utf8`);
    data = JSON.parse(data);
    data = data.map((item) => {
      delete item.id;
      item.password = hashPassword(item.password);
      item.createdAt = new Date();
      item.updatedAt = new Date();
      return item;
    });

    await queryInterface.bulkInsert(`Users`, data, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(`Users`, null, {});
  }
};
