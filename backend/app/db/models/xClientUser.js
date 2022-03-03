'use strict'
module.exports = (sequelize, DataTypes) => {
  const XClientUser = sequelize.define('XClientUser', {
    client_user_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  },
  {
    tableName: 'x_client_users',
    timestamps: false
  })
  XClientUser.associate = function (models) {
  }
  return XClientUser
}
