'use strict'

module.exports = (sequelize, DataTypes) => {
  const XQodUserSkill = sequelize.define('XQodUserSkill', {
    user_skill_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    endorsed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      field: 'created_on',
      type: DataTypes.DATE
    },
    updatedAt: {
      field: 'updated_on',
      type: DataTypes.DATE
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'x_qod_user_skills',
    timestamps: true
  })
  XQodUserSkill.associate = function (models) {
    XQodUserSkill.belongsTo(models.XQodSkill, { as: 'skill', foreignKey: 'skill_id' })
  }
  return XQodUserSkill
}
