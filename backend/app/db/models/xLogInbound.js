'use strict'
module.exports = (sequelize, DataTypes) => {
  const XLogInbound = sequelize.define('XLogInbound', {
    closecallid: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    lead_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      allowNull: false
    },
    list_id: DataTypes.BIGINT(14).UNSIGNED,
    campaign_id: DataTypes.STRING(20),
    call_date: DataTypes.DATE,
    start_epoch: DataTypes.INTEGER(10).UNSIGNED,
    end_epoch: DataTypes.INTEGER(10).UNSIGNED,
    length_in_sec: DataTypes.INTEGER(10),
    status: DataTypes.STRING(6),
    phone_code: DataTypes.STRING(10),
    phone_number: DataTypes.STRING(18),
    user: DataTypes.STRING(100),
    comments: DataTypes.STRING,
    processed: {
      type: DataTypes.ENUM,
      values: ['Y', 'N', 'WEBPHONE']
    },
    queue_seconds: {
      type: DataTypes.DECIMAL(7, 2),
      defaultValue: 0.00
    },
    user_group: DataTypes.STRING(20),
    xfercallid: DataTypes.INTEGER(9).UNSIGNED,
    term_reason: {
      type: DataTypes.ENUM,
      values: [
        'CALLER',
        'AGENT',
        'QUEUETIMEOUT',
        'ABANDON',
        'AFTERHOURS',
        'HOLDRECALLXFER',
        'HOLDTIME',
        'NOAGENT',
        'NONE',
        'MAXQUEUE'],
      defaultValue: 'NONE'
    },
    uniqueid: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    agent_only: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    queue_position: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      defaultValue: 1
    }
  },
  {
    tableName: 'x_log_inbound'
  })
  XLogInbound.associate = function (models) {
  }
  return XLogInbound
}
