'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodJobCourse = sequelize.define('XQodJobCourse', {
    job_course_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    job_id: DataTypes.INTEGER(11),
    course_id: DataTypes.INTEGER(11),
    course_preference: {
      type: DataTypes.ENUM,
      values: ['required', 'optional', 'plus']
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'x_qod_job_courses'
  })
  XQodJobCourse.associate = function (models) {
  }
  return XQodJobCourse
}
