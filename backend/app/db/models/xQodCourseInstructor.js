'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodCourseInstructor = sequelize.define('XQodCourseInstructor', {
    instructor_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    course_id: DataTypes.INTEGER(11),
    user_id: DataTypes.INTEGER(11),
    bio: DataTypes.STRING,
    avg_rating: DataTypes.INTEGER,
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'x_qod_course_instructors'
  })
  XQodCourseInstructor.associate = function (models) {
  }
  return XQodCourseInstructor
}
