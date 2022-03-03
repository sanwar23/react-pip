'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date()
    await queryInterface.bulkInsert('x_forum_channels', [
      {
        channel_title: 'General Announcements',
        channel_description: 'This channel is used to create posts about various company announcements. From new hires, to new policies or related topics. Find them all here, and participate!',
        owner_id: 1,
        client_id: 1,
        category_id: 1,
        is_public: true,
        is_company_ann: true,
        created_on: date
      },
      {
        channel_title: 'Hiring the Right People',
        channel_description: "Let's talk about how hiring the right people is a best practice for having delivering a great customer Service!",
        owner_id: 1,
        client_id: 1,
        category_id: 2,
        is_public: true,
        is_company_ann: true,
        created_on: date
      },
      {
        channel_title: 'Managing Customer Expectations',
        channel_description: "Just as in our personal life, managing expectations is a critical part of customer service. Don't agree ? Let's talk about it.",
        owner_id: 1,
        client_id: 1,
        category_id: 2,
        is_public: true,
        is_company_ann: true,
        created_on: date
      },
      {
        channel_title: 'Perfecting First Impressions',
        channel_description: '',
        owner_id: 1,
        client_id: 1,
        category_id: 2,
        is_public: true,
        is_company_ann: true,
        created_on: date
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('x_forum_channels')
  }
}
