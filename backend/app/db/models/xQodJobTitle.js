'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodJobTitle = sequelize.define('XQodJobTitle', {
    job_title_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    job_title_name: DataTypes.STRING(100)
  },
  {
    tableName: 'x_qod_job_titles'
  })
  XQodJobTitle.associate = function (models) {
  }
  return XQodJobTitle
}
