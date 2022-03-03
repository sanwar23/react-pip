'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodCourseUnitsUser = sequelize.define('XQodCourseUnitsUser', {
    unit_user_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER(11),
    course_id: DataTypes.INTEGER(11),
    unit_id: DataTypes.INTEGER(11),
    status: {
      type: DataTypes.ENUM,
      values: ['inprogress', 'completed', 'abandoned']
    },
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
    tableName: 'x_qod_course_units_user',
    timestamps: true
  })
  XQodCourseUnitsUser.associate = function (models) {
  }
  return XQodCourseUnitsUser
}
