'use strict'
module.exports = (sequelize, DataTypes) => {
  const XPhoneCodes = sequelize.define('XPhoneCodes', {
    phone_code_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country_code: DataTypes.SMALLINT(5).UNSIGNED,
    country: DataTypes.CHAR(3),
    areacode: DataTypes.CHAR(3),
    state: DataTypes.STRING(4),
    GMT_offset: {
      type: DataTypes.STRING(6),
      defaultValue: ''
    },
    DST: {
      type: DataTypes.ENUM,
      values: ['Y', 'N']
    },
    DST_range: DataTypes.STRING(8),
    geographic_description: DataTypes.STRING(30),
    tz_code: {
      type: DataTypes.STRING(4),
      defaultValue: ''
    },
    rate: {
      type: DataTypes.DECIMAL(10, 3),
      defaultValue: 0.020
    }
  },
  {
    tableName: 'x_phone_codes'
  })
  XPhoneCodes.associate = function (models) { }
  return XPhoneCodes
}
