'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodCourseUnit = sequelize.define('XQodCourseUnit', {
    unit_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    section_id: DataTypes.INTEGER(11),
    unit_num: DataTypes.STRING(100),
    title: DataTypes.STRING,
    details: DataTypes.TEXT,
    length: DataTypes.INTEGER(11),
    type: {
      type: DataTypes.ENUM,
      values: ['Article', 'Audio', 'Video']
    },
    order: DataTypes.INTEGER,
    createdAt: {
      field: 'created_on',
      type: DataTypes.DATE
    },
    updatedAt: {
      field: 'updated_on',
      type: DataTypes.DATE
    }
  },
  {
    tableName: 'x_qod_course_units',
    timestamps: true
  })
  XQodCourseUnit.associate = function (models) {
  }
  return XQodCourseUnit
}
