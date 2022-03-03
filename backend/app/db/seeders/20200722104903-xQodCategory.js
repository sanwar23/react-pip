'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('x_qod_categories', [
      {
        category_id: 1,
        category_name: 'Accounting'
      },
      {
        category_id: 2,
        category_name: 'Client Services'
      },
      {
        category_id: 3,
        category_name: 'Customer Service'
      },
      {
        category_id: 4,
        category_name: 'Human Resources'
      },
      {
        category_id: 5,
        category_name: 'Inbound'
      },
      {
        category_id: 6,
        category_name: 'Information Technology'
      },
      {
        category_id: 7,
        category_name: 'Operations'
      },
      {
        category_id: 8,
        category_name: 'Outbound'
      },
      {
        category_id: 9,
        category_name: 'Quality Assurance'
      },
      {
        category_id: 10,
        category_name: 'Sales'
      },
      {
        category_id: 11,
        category_name: 'Support'
      },
      {
        category_id: 12,
        category_name: 'Telemarketing'
      },
      {
        category_id: 13,
        category_name: 'Training'
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('x_qod_categories')
  }
}
