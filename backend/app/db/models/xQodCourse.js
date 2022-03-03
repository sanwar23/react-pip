'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodCourse = sequelize.define('XQodCourse', {
    course_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    category_id: DataTypes.INTEGER(11),
    creator_id: DataTypes.INTEGER(11),
    title: DataTypes.STRING(100),
    description: DataTypes.TEXT,
    goals: DataTypes.TEXT,
    requirements: DataTypes.TEXT,
    outcomes: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    video_url: DataTypes.STRING,
    language: {
      type: DataTypes.ENUM,
      values: ['English', 'Spanish', 'French'],
      defaultValue: 'French'
    },
    token_price: DataTypes.DOUBLE,
    visibility: {
      type: DataTypes.ENUM,
      values: ['private', 'public'],
      defaultValue: 'public'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['published', 'draft'],
      defaultValue: 'published'
    },
    rating: {
      type: DataTypes.FLOAT(2, 1),
      defaultValue: 0.0
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
    tableName: 'x_qod_courses',
    timestamps: true
  })
  XQodCourse.associate = function (models) {
    XQodCourse.hasMany(models.XQodCourseSection, { as: 'sections', foreignKey: 'course_id' })
    XQodCourse.hasMany(models.XQodUserCourse, { as: 'students', foreignKey: 'course_id' })
    XQodCourse.belongsTo(models.UserDetail, { as: 'creatorDetails', foreignKey: 'creator_id' })
    XQodCourse.hasMany(models.XQodCourseUserQA, { as: 'userTest', foreignKey: 'course_id' })
  }
  return XQodCourse
}
