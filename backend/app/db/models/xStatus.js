'use strict'
module.exports = (sequelize, DataTypes) => {
  const XStatus = sequelize.define('XStatus', {
    status: {
      allowNull: false,
      type: DataTypes.STRING(6),
      primaryKey: true
    },
    status_name: DataTypes.STRING(30),
    selectable: {
      type: DataTypes.ENUM,
      values: ['Y', 'N']
    },
    human_answered: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    category: {
      type: DataTypes.STRING(20),
      defaultValue: 'UNDEFINED'
    },
    sale: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    dnc: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    customer_contact: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    not_interested: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    unworkable: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    scheduled_callback: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    custom_code: DataTypes.STRING(45)
  },
  {
    tableName: 'x_statuses',
    timestamps: false
  })
  XStatus.associate = function (models) {
  }
  return XStatus
}
