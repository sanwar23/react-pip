'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('x_qod_job_titles', [
      {
        job_title_id: 1,
        job_title_name: 'Customer Service Representative'
      },
      {
        job_title_id: 2,
        job_title_name: 'Call Center Agent'
      },
      {
        job_title_id: 3,
        job_title_name: 'Call Center Manager'
      },
      {
        job_title_id: 4,
        job_title_name: 'Sales Account Advisors'
      },
      {
        job_title_id: 5,
        job_title_name: 'Business Development Specialist'
      },
      {
        job_title_id: 6,
        job_title_name: 'Retail Sales Consultant'
      },
      {
        job_title_id: 7,
        job_title_name: 'Account Consultant'
      },
      {
        job_title_id: 8,
        job_title_name: 'Chief Customer Officer'
      },
      {
        job_title_id: 9,
        job_title_name: 'Customer Advocate'
      },
      {
        job_title_id: 10,
        job_title_name: 'Voice of the Customer'
      },
      {
        job_title_id: 11,
        job_title_name: 'Director of Customer Experience'
      },
      {
        job_title_id: 12,
        job_title_name: 'Customer Experience Manager'
      },
      {
        job_title_id: 13,
        job_title_name: 'Customer Success Team Lead'
      },
      {
        job_title_id: 14,
        job_title_name: 'Implementation Specialist'
      }

    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('x_qod_job_titles')
  }
}
