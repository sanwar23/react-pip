'use strict'
module.exports = (sequelize, DataTypes) => {
  const XLiveCall = sequelize.define('XLiveCall', {
    auto_call_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    server_ip: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    campaign_id: DataTypes.STRING(20),
    status: {
      type: DataTypes.ENUM,
      values: ['SENT', 'RINGING', 'LIVE', 'XFER', 'PAUSED', 'CLOSER', 'BUSY', 'DISCONNECT', 'IVR'],
      defaultValue: 'PAUSED'
    },
    lead_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      allowNull: false
    },
    uniqueid: DataTypes.STRING(20),
    callerid: DataTypes.STRING(20),
    channel: DataTypes.STRING(100),
    phone_code: DataTypes.STRING(10),
    phone_number: DataTypes.STRING(18),
    call_time: DataTypes.DATE,
    call_type: {
      type: DataTypes.ENUM,
      values: ['IN', 'OUT', 'OUTBALANCE'],
      defaultValue: 'OUT'
    },
    stage: {
      type: DataTypes.STRING(20),
      defaultValue: 'START'
    },
    last_update_time: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: false
    },
    alt_dial: {
      type: DataTypes.STRING(6),
      defaultValue: 'NONE'
    },
    queue_priority: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0
    },
    agent_only: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    agent_grab: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    queue_position: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      defaultValue: 1
    },
    extension: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    agent_grab_extension: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    }
  },
  {
    tableName: 'x_live_calls',
    timestamps: false
  })
  XLiveCall.associate = function (models) {}
  return XLiveCall
}
