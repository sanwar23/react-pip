'use strict'
module.exports = (sequelize, DataTypes) => {
  const XAppUser = sequelize.define('XAppUser', {
    app_user_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER(9).UNSIGNED
    },
    app_id: {
      allowNull: true,
      type: DataTypes.INTEGER(11)
    }
  },
  {
    tableName: 'x_apps_user'
  })
  XAppUser.associate = function (models) {
    XAppUser.belongsTo(models.XApp, { foreignKey: 'app_id', targetKey: 'app_id' })
  }
  return XAppUser
}
