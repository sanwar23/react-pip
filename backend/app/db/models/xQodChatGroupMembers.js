'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodChatGroupMembers = sequelize.define('XQodChatGroupMembers', {
    group_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    conversation_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    is_removed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      field: 'created_on',
      type: DataTypes.DATE(3)
    },
    updatedAt: {
      field: 'updated_on',
      type: DataTypes.DATE(3)
    }
  },
  {
    tableName: 'x_qod_chat_group_members',
    timestamps: true
  })
  XQodChatGroupMembers.associate = function (models) {
  }
  return XQodChatGroupMembers
}
