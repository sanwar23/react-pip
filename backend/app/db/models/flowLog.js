'use strict'
module.exports = (sequelize, DataTypes) => {
  const FlowLog = sequelize.define('FlowLog', {
    flow_log_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(9).UNSIGNED
    },
    client_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      defaultValue: 0
    },
    flow_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    lead_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      defaultValue: 0
    },
    list_id: {
      type: DataTypes.BIGINT(14).UNSIGNED,
      defaultValue: 0
    },
    call_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    cost: {
      type: DataTypes.STRING(10),
      defaultValue: '$0.000'
    },
    rate: {
      type: DataTypes.STRING(10),
      defaultValue: '0.005'
    },
    uniqueid: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    user: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    }
  },
  { tableName: 'x_flow_log' })
  FlowLog.associate = function (models) {}
  return FlowLog
}
