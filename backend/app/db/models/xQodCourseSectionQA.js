'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodCourseSectionQA = sequelize.define('XQodCourseSectionQA', {
    section_qa_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    section_id: DataTypes.INTEGER(11),
    question_type: {
      type: DataTypes.ENUM,
      values: ['text', 'paragraph', 'multiple', 'checkbox', 'scale', 'date', 'time']
    },
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    option1: DataTypes.TEXT,
    option2: DataTypes.TEXT,
    option3: DataTypes.TEXT,
    option4: DataTypes.TEXT,
    option5: DataTypes.TEXT,
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
    tableName: 'x_qod_course_section_qa',
    timestamps: true
  })
  XQodCourseSectionQA.associate = function (models) {
  }
  return XQodCourseSectionQA
}
