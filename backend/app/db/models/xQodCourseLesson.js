'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodCourseLesson = sequelize.define('XQodCourseLesson', {
    lesson_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    course_id: DataTypes.INTEGER(11),
    section_id: DataTypes.INTEGER(11),
    lesson_num: DataTypes.STRING,
    title: DataTypes.STRING,
    details: DataTypes.TEXT,
    length: DataTypes.INTEGER,
    notes: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
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
    tableName: 'x_qod_course_lessons',
    timestamps: true
  })
  XQodCourseLesson.associate = function (models) {
  }
  return XQodCourseLesson
}
