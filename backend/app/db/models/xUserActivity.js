'use strict'
module.exports = (sequelize, DataTypes) => {
  const XUserActivity = sequelize.define('XUserActivity', {
    user_activity_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER(9),
    record_type: {
      type: DataTypes.ENUM,
      values: ['client', 'user', 'topic', 'activity', 'course']
    },
    record_id: {
      type: DataTypes.INTEGER(11)
    },
    activity_type: {
      type: DataTypes.ENUM,
      values: ['like', 'subscribe', 'connection', 'status', 'comment',
        'rating_culture', 'rating_leadership', 'rating_career', 'rating_compensation',
        'rating_performance', 'rating_teamplayer', 'rating_interaction', 'rating_dependability',
        'rating_value', 'rating_clarity', 'rating_content', 'rating_structure', 'endorsement'
      ]
    },
    activity_value: DataTypes.TEXT,
    activity_custom: DataTypes.STRING,
    activity_permission: {
      type: DataTypes.ENUM,
      values: ['public', 'followers', 'company', 'admins', 'managers'],
      defaultValue: 'public'
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    charset: 'utf8',
    collate: 'utf8_general_ci',
    tableName: 'x_user_activities',
    timestamps: true
  })
  XUserActivity.associate = function (models) {
    XUserActivity.belongsTo(models.UserDetail, { as: 'userData', foreignKey: 'user_id' })
  }
  return XUserActivity
}
