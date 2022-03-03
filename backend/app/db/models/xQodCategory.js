'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodCategory = sequelize.define('XQodCategory', {
    category_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    category_name: DataTypes.STRING(100)
  },
  {
    tableName: 'x_qod_categories'
  })
  XQodCategory.associate = function (models) {
    XQodCategory.hasMany(models.XQodJob, { as: 'jobs', foreignKey: 'category_id' })
  }
  return XQodCategory
}
