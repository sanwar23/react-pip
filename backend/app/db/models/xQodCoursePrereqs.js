'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodCoursePrereqs = sequelize.define('XQodCoursePrereqs', {
    course_prereq_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    course_id: DataTypes.INTEGER(11),
    prereq_course_id: DataTypes.INTEGER(11)
  },
  {
    tableName: 'x_qod_course_prereqs'
  })
  XQodCoursePrereqs.associate = function (models) {
  }
  return XQodCoursePrereqs
}
