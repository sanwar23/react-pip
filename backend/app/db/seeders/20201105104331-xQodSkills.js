'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('x_qod_skills', [
      {
        skill_id: 1,
        skill_name: 'Active listening'
      },
      {
        skill_id: 2,
        skill_name: 'Adaptability'
      },
      {
        skill_id: 3,
        skill_name: 'Adobe Creative Cloud'
      },
      {
        skill_id: 4,
        skill_name: 'Adobe InDesign'
      },
      {
        skill_id: 5,
        skill_name: 'Adobe Photoshop'
      },
      {
        skill_id: 6,
        skill_name: 'Appointment setting'
      },
      {
        skill_id: 7,
        skill_name: 'Approachable'
      },
      {
        skill_id: 8,
        skill_name: 'Clarity of expression'
      },
      {
        skill_id: 9,
        skill_name: 'Client relations'
      },
      {
        skill_id: 10,
        skill_name: 'Close attention to detail'
      },
      {
        skill_id: 11,
        skill_name: 'Communication skills'
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('x_qod_skills')
  }
}
