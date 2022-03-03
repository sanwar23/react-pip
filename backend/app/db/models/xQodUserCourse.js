'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodUserCourse = sequelize.define('XQodUserCourse', {
    user_course_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER(11),
    course_id: DataTypes.INTEGER(11),
    job_id: DataTypes.INTEGER(11),
    date_started: {
      type: DataTypes.DATE
    },
    date_completed: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM,
      values: ['enrolled', 'inprogress', 'dropped', 'completed']
    },
    grade: DataTypes.DOUBLE,
    certificate_nft_id: DataTypes.INTEGER(11),
    endorsed: DataTypes.INTEGER,
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
    tableName: 'x_qod_user_courses',
    timestamps: true
  })
  XQodUserCourse.associate = function (models) {
    XQodUserCourse.belongsTo(models.XQodCourse, { as: 'courseDetails', foreignKey: 'course_id' })
  }
  return XQodUserCourse
}
