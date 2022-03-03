'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date()
    await queryInterface.bulkInsert('x_forum_topics', [
      {
        topic_title: 'New schedule during covid-19 pandemic',
        tags: 'Company,Internal',
        owner_id: 1,
        channel_id: 1,
        is_public: true,
        is_flagged: true,
        created_on: date
      },
      {
        topic_title: 'Welcome our new director of changing the world',
        tags: 'Partnership,Global',
        owner_id: 2,
        channel_id: 1,
        is_public: true,
        is_flagged: true,
        created_on: date
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('x_forum_topics')
  }
}
