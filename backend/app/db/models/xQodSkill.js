'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodSkill = sequelize.define('XQodSkill', {
    skill_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    skill_name: DataTypes.STRING(100)
  },
  {
    tableName: 'x_qod_skills'
  })
  XQodSkill.associate = function (models) {
  }
  return XQodSkill
}
