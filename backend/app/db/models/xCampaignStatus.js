'use strict'
module.exports = (sequelize, DataTypes) => {
  const XCampaignStatus = sequelize.define('XCampaignStatus', {
    campaign_status_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING(6)
    },
    status_name: DataTypes.STRING(30),
    selectable: {
      type: DataTypes.ENUM,
      values: ['Y', 'N']
    },
    campaign_id: DataTypes.STRING(20),
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
    custom_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  },
  {
    tableName: 'x_statuses_campaigns',
    timestamps: false
  })
  XCampaignStatus.associate = function (models) {
  }
  return XCampaignStatus
}
