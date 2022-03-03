'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodResourceDef = sequelize.define('XQodResourceDef', {
    resource_def_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    desired_job_type: {
      type: DataTypes.ENUM,
      values: ['fulltime', 'parttime', 'contract', 'ondemand'],
      defaultValue: 'ondemand'
    },
    desired_duration_type: {
      type: DataTypes.ENUM,
      values: ['ondemand', 'upto1month', 'upto3months', 'upto6months', 'morethan6months'],
      defaultValue: 'ondemand'
    },
    desired_employment_type: {
      type: DataTypes.ENUM,
      values: ['employee', 'freelancer'],
      defaultValue: 'freelancer'
    },
    desired_experience_type: {
      type: DataTypes.ENUM,
      values: ['entrylevel', 'intermediate', 'expert'],
      defaultValue: 'entrylevel'
    },
    desired_location_type: {
      type: DataTypes.ENUM,
      values: ['remote', 'onsite'],
      defaultValue: 'remote'
    },
    desired_languages: {
      type: DataTypes.ENUM,
      values: ['english', 'spanish', 'french'],
      defaultValue: 'english'
    },
    desired_min_pay: DataTypes.DOUBLE,
    desired_max_pay: DataTypes.DOUBLE,
    desired_pay_type: {
      type: DataTypes.ENUM,
      values: ['hourly', 'monthly', 'annually'],
      defaultValue: 'hourly'
    },
    desired_pay_frequency: {
      type: DataTypes.ENUM,
      values: ['weekly', 'biweekly', 'monthly'],
      defaultValue: 'weekly'
    },
    avg_peer_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    avg_owner_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lifetime_pay: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM,
      values: ['available', 'unavailable', 'on vacation']
    },
    is_visible: {
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
    tableName: 'x_qod_resource_defs',
    timestamps: true
  })
  XQodResourceDef.associate = function (models) {
    XQodResourceDef.belongsTo(models.UserDetail, { foreignKey: 'user_id' })
  }
  return XQodResourceDef
}
