'use strict'
module.exports = (sequelize, DataTypes) => {
  const XLogDID = sequelize.define('XLogDID', {
    uniqueid: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    channel: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    server_ip: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    caller_id_number: DataTypes.STRING(18),
    caller_id_name: DataTypes.STRING(20),
    extension: DataTypes.STRING(100),
    call_date: DataTypes.DATE,
    did_id: {
      type: DataTypes.STRING(9),
      defaultValue: ''
    },
    did_route: {
      type: DataTypes.STRING(9),
      defaultValue: ''
    }
  },
  {
    tableName: 'x_log_did'
  })
  XLogDID.associate = function (models) {
  }
  XLogDID.removeAttribute('id')
  return XLogDID
}
