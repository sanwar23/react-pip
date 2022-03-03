// x_client_campaigns
'use strict'
module.exports = (sequelize, DataTypes) => {
  const XClientCampaign = sequelize.define('XClientCampaign', {
    client_campaign_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    campaign_id: DataTypes.STRING(8)
  },
  {
    tableName: 'x_client_campaigns'
  })
  XClientCampaign.associate = function (models) {
  }
  return XClientCampaign
}
