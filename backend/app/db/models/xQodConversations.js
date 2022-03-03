'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodConversations = sequelize.define('XQodConversations', {
    conversation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    is_group: DataTypes.BOOLEAN,
    group_title: DataTypes.STRING,
    user_one_id: DataTypes.INTEGER,
    user_two_id: DataTypes.INTEGER,
    createdAt: {
      field: 'created_on',
      type: DataTypes.DATE
    },
    updatedAt: {
      field: 'updated_on',
      type: DataTypes.DATE
    }
  },
  {
    tableName: 'x_qod_conversations',
    timestamps: true
  })
  XQodConversations.associate = function (models) {
    XQodConversations.hasMany(models.XQodChatGroupMembers, { as: 'group', foreignKey: 'conversation_id' })
    XQodConversations.hasMany(models.XQodUserConversationsStatus, { as: 'allRead', foreignKey: 'conversation_id' })
    XQodConversations.hasMany(models.XQodChatMessage, { as: 'messages', foreignKey: 'conversation_id' })
  }
  return XQodConversations
}
