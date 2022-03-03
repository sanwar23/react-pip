'use strict'
module.exports = (sequelize, DataTypes) => {
  const XLogOutbound = sequelize.define('XLogOutbound', {
    uniqueid: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    lead_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      allowNull: false
    },
    list_id: DataTypes.BIGINT(14).UNSIGNED,
    campaign_id: DataTypes.STRING(8),
    call_date: DataTypes.DATE,
    start_epoch: DataTypes.INTEGER(10).UNSIGNED,
    end_epoch: DataTypes.INTEGER(10).UNSIGNED,
    length_in_sec: DataTypes.INTEGER(10),
    status: DataTypes.STRING(6),
    phone_code: DataTypes.STRING(10),
    phone_number: DataTypes.STRING(18),
    user: DataTypes.STRING(100),
    comments: DataTypes.STRING(255),
    processed: {
      type: DataTypes.ENUM,
      values: ['Y', 'N', 'WEBPHONE']
    },
    user_group: DataTypes.STRING(20),
    term_reason: {
      type: DataTypes.ENUM,
      values: ['CALLER', 'AGENT', 'QUEUETIMEOUT', 'ABANDON', 'AFTERHOURS', 'NONE'],
      defaultValue: 'NONE'
    },
    alt_dial: {
      type: DataTypes.STRING(6),
      defaultValue: 'NONE'
    }
  },
  {
    tableName: 'x_log_outbound'
  })
  XLogOutbound.associate = function (models) { }
  return XLogOutbound
}
