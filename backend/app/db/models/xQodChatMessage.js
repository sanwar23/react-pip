'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodChatMessage = sequelize.define('XQodChatMessage', {
    message_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    sender_id: DataTypes.INTEGER,
    conversation_id: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    is_notification: DataTypes.BOOLEAN,
    sent_at: DataTypes.DATE(3)
  },
  {
    tableName: 'x_qod_chat_messages'
  })
  XQodChatMessage.associate = function (models) {
    XQodChatMessage.hasMany(models.XQodChatMessagesReadStatus, { as: 'messageReadStatus', foreignKey: 'message_id' })
    XQodChatMessage.belongsTo(models.UserDetail, { as: 'senderDetails', foreignKey: 'sender_id' })
    XQodChatMessage.belongsTo(models.XQodConversations, { as: 'conversation', foreignKey: 'conversation_id' })
  }
  return XQodChatMessage
}
