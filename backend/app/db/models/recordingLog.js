'use strict'
module.exports = (sequelize, DataTypes) => {
  const RecordingLog = sequelize.define('RecordingLog', {
    recording_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    channel: DataTypes.STRING(100),
    server_ip: DataTypes.STRING(15),
    extension: DataTypes.STRING(100),
    start_time: DataTypes.DATE,
    start_epoch: DataTypes.INTEGER(10).UNSIGNED,
    end_time: DataTypes.DATE,
    end_epoch: DataTypes.INTEGER(10).UNSIGNED,
    length_in_sec: DataTypes.INTEGER(8).UNSIGNED,
    length_in_min: DataTypes.DECIMAL(8, 2),
    filename: DataTypes.STRING(100),
    location: DataTypes.STRING,
    lead_id: DataTypes.INTEGER(9).UNSIGNED,
    user: DataTypes.STRING(100),
    vicidial_id: DataTypes.STRING(20),
    file_size: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      defaultValue: 0
    }
  },
  {
    tableName: 'recording_log'
  })
  RecordingLog.associate = function (models) { }
  return RecordingLog
}
