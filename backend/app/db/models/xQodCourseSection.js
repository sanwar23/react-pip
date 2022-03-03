'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodCourseSection = sequelize.define('XQodCourseSection', {
    section_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    course_id: DataTypes.INTEGER(11),
    section_num: DataTypes.STRING(100),
    title: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
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
    tableName: 'x_qod_course_sections',
    timestamps: true
  })
  XQodCourseSection.associate = function (models) {
    XQodCourseSection.hasMany(models.XQodCourseUnit, { as: 'units', foreignKey: 'section_id', onDelete: 'cascade' })
    XQodCourseSection.hasMany(models.XQodCourseSectionQA, { as: 'questions', foreignKey: 'section_id', onDelete: 'cascade' })
  }
  return XQodCourseSection
}
