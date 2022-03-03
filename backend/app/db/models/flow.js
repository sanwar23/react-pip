'use strict'
module.exports = (sequelize, DataTypes) => {
  const Flow = sequelize.define('Flow', {
    flow_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(9).UNSIGNED
    },
    client_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    flow_name: DataTypes.STRING(50),
    flow_description: DataTypes.STRING(200),
    flow_changed: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  { tableName: 'x_flows' })
  Flow.associate = function (models) {}
  return Flow
}
