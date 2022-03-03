'use strict'
module.exports = (sequelize, DataTypes) => {
  const XClientInGroup = sequelize.define('XClientInGroup', {
    client_ingroup_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    group_id: DataTypes.STRING(20),
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  },
  {
    tableName: 'x_client_ingroups',
    timestamps: false
  })
  XClientInGroup.associate = function (models) {
  }
  return XClientInGroup
}
