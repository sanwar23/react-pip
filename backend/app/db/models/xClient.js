'use strict'
module.exports = (sequelize, DataTypes) => {
  const XClient = sequelize.define('XClient', {

    client_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    client_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER(1),
      defaultValue: 1
    },
    client_username: DataTypes.STRING(100),
    title: DataTypes.STRING(100),
    summary: DataTypes.TEXT,
    rating: {
      type: DataTypes.FLOAT(2, 1),
      defaultValue: 0.0
    },
    address1: DataTypes.STRING(100),
    address2: DataTypes.STRING(100),
    city: DataTypes.STRING(100),
    state: DataTypes.STRING(100),
    zip: DataTypes.STRING(10),
    phone_number: DataTypes.STRING(15),
    email: DataTypes.STRING(100),
    website: DataTypes.STRING(100),
    minutes_overflow: {
      type: DataTypes.INTEGER(11),
      defaultValue: 200
    },
    registration_date: DataTypes.DATE,
    source: DataTypes.STRING(100),
    intended_use: DataTypes.STRING(100),
    interactions_per_month: DataTypes.STRING(100),
    rate: {
      type: DataTypes.DECIMAL(10, 3),
      defaultValue: 0.002
    },
    flow_rate: {
      type: DataTypes.DECIMAL(10, 3),
      defaultValue: 0.005
    },
    webphone_rate: {
      type: DataTypes.DECIMAL(10, 3),
      defaultValue: 0.005
    },
    gmt_offset_now: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: -5.00
    },
    client_ein: DataTypes.STRING
  },
  {
    tableName: 'x_clients',
    timestamps: false
  })
  XClient.associate = function (models) {
  }
  return XClient
}
