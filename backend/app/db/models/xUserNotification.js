'use strict'
module.exports = (sequelize, DataTypes) => {
  const XUserNotification = sequelize.define('XUserNotification', {
    notification_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      allowNull: false
    },
    notice: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'x_user_notifications'
  })
  XUserNotification.associate = function (models) {
  }
  return XUserNotification
}
