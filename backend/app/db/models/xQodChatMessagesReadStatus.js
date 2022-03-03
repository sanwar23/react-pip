'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodChatMessagesReadStatus = sequelize.define('XQodChatMessagesReadStatus', {
    message_read_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    message_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    is_read: DataTypes.BOOLEAN
  },
  {
    tableName: 'x_qod_chat_messages_read_status'
  })
  XQodChatMessagesReadStatus.associate = function (models) {
  }
  return XQodChatMessagesReadStatus
}
