'use strict'
module.exports = (sequelize, DataTypes) => {
  const Lead = sequelize.define('Lead', {
    lead_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(9).UNSIGNED
    },
    entry_date: DataTypes.DATE,
    modify_date: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: false
    },
    status: DataTypes.STRING(6),
    user: DataTypes.STRING(20),
    vendor_lead_code: DataTypes.STRING(100),
    source_id: DataTypes.STRING(50),
    list_id: {
      type: DataTypes.BIGINT(14).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    gmt_offset_now: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      primaryKey: true,
      defaultValue: -5.00
    },
    called_since_last_reset: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7', 'Y8', 'Y9', 'Y10']
    },
    phone_code: {
      type: DataTypes.STRING(10),
      defaultValue: '1'
    },
    phone_number: {
      type: DataTypes.STRING(18),
      allowNull: false
    },
    title: DataTypes.STRING(30),
    first_name: DataTypes.STRING(30),
    middle_initial: DataTypes.STRING(10),
    last_name: DataTypes.STRING(30),
    address1: DataTypes.STRING(100),
    address2: DataTypes.STRING(100),
    address3: DataTypes.STRING(100),
    city: DataTypes.STRING(50),
    state: DataTypes.STRING(2),
    province: DataTypes.STRING(50),
    postal_code: DataTypes.STRING(10),
    country_code: DataTypes.STRING(3),
    gender: {
      type: DataTypes.ENUM,
      defaultValue: 'U',
      values: ['M', 'F', 'U']
    },
    date_of_birth: DataTypes.DATEONLY,
    alt_phone: DataTypes.STRING(12),
    email: DataTypes.STRING(70),
    security_phrase: DataTypes.STRING(100),
    comments: DataTypes.STRING(512),
    called_count: {
      type: DataTypes.SMALLINT(5).UNSIGNED,
      defaultValue: 0
    },
    last_local_call_time: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    rank: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    owner: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    entry_list_id: {
      type: DataTypes.BIGINT(14).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    tableName: 'x_leads'
  })
  Lead.associate = function (models) {}
  return Lead
}
