'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date()
    await queryInterface.bulkInsert('x_forum_users', [
      {
        user_id: 1,
        forum_object_type: 'channel',
        forum_object_id: 1,
        is_moderator: true,
        created_on: date
      },
      {
        user_id: 2,
        forum_object_type: 'channel',
        forum_object_id: 1,
        is_moderator: true,
        created_on: date
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('x_forum_users')
  }
}
