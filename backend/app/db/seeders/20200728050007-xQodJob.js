'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date()
    await queryInterface.bulkInsert('x_qod_jobs', [
      {
        client_id: 1,
        user_id: 1,
        category_id: 1,
        position_id: 1,
        title: 'Looking for Expirienced Customer service specialist',
        description: 'We are looking for candidates expirienced in inbound customer service for our growing contact center buiseness unit!',
        city: 'Indore',
        state: 'MP',
        country: 'India',
        needed: 1,
        fulfilled: 1,
        pay_amount: 100,
        pay_type: 'monthly',
        created_on: date
      },
      {
        client_id: 1,
        user_id: 1,
        category_id: 2,
        position_id: 1,
        title: 'Inboud Customer Service',
        description: 'ABC Company is seeking entry-level ...',
        city: 'Indore',
        state: 'MP',
        country: 'India',
        needed: 1,
        fulfilled: 1,
        pay_amount: 100,
        pay_type: 'monthly',
        created_on: date
      },
      {
        client_id: 1,
        user_id: 1,
        category_id: 2,
        position_id: 1,
        title: 'Outount Customer Service and Sales',
        description: 'Are you great with providing customer service and performing outbound cold calls...',
        city: 'Indore',
        state: 'MP',
        country: 'India',
        needed: 1,
        fulfilled: 1,
        pay_amount: 100,
        pay_type: 'monthly',
        created_on: date
      }

    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('x_qod_jobs')
  }
}
