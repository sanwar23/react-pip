'use strict'
module.exports = (sequelize, DataTypes) => {
  const XApp = sequelize.define('XApp', {
    app_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    iconpath: {
      type: DataTypes.STRING(45)
    },
    controllerpath: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    title: DataTypes.STRING(45),
    alt: DataTypes.STRING(45),
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    min_userlevel: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0
    },
    sortorder: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  },
  {
    tableName: 'x_apps'
  })
  XApp.associate = function (models) {
    XApp.hasMany(models.XAppUser, { foreignKey: 'app_id' })
  }
  return XApp
}
