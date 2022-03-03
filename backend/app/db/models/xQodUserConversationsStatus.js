'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodUserConversationsStatus = sequelize.define('XQodUserConversationsStatus', {
    conversation_status_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    conversation_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    all_read: DataTypes.BOOLEAN,
    deleted_on: DataTypes.DATE(3)
  },
  {
    tableName: 'x_qod_user_conversations_status'
  })
  XQodUserConversationsStatus.associate = function (models) {
  }
  return XQodUserConversationsStatus
}
