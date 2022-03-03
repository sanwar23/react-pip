'use strict'
module.exports = (sequelize, DataTypes) => {
  const FlowField = sequelize.define('FlowField', {
    field_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(9).UNSIGNED
    },
    flow_id: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER(9).UNSIGNED
    },
    page: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      defaultValue: 1
    },
    field_label: DataTypes.STRING(50),
    field_name: DataTypes.STRING(5000),
    field_description: DataTypes.STRING(100),
    field_rank: DataTypes.SMALLINT(5),
    field_help: DataTypes.STRING(1000),
    field_type: {
      type: DataTypes.ENUM,
      defaultValue: 'TEXTAREA',
      values: [
        'SCRIPT',
        'NAVIGATION',
        'CONDITION',
        'CALCULATION',
        'IFRAME',
        'IMAGE',
        'TEXTFIELD',
        'TEXTAREA',
        'DROPDOWN',
        'MULTISELECTION',
        'RADIOBUTTON',
        'CHECKBOX',
        'DATEPICKER',
        'SPACE',
        'ACTION',
        'TIMEPICKER'
      ]
    },
    field_options: DataTypes.STRING(5000),
    field_size: DataTypes.STRING(5),
    field_max: DataTypes.STRING(5),
    field_default: DataTypes.STRING(8000),
    field_required: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    name_position: {
      type: DataTypes.ENUM,
      defaultValue: 'LEFT',
      values: ['LEFT', 'CENTER', 'RIGHT', 'BLOCK']
    },
    multi_position: {
      type: DataTypes.ENUM,
      defaultValue: 'HORIZONTAL',
      values: ['HORIZONTAL', 'VERTICAL', 'RANDOMIZE']
    },
    field_order: {
      type: DataTypes.SMALLINT(5),
      defaultValue: 1
    },
    goto_page: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      defaultValue: 0
    },
    goto_field: DataTypes.STRING(50),
    field_min: DataTypes.SMALLINT(5),
    field_hidden: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    field_pattern: DataTypes.STRING(50),
    field_validations: DataTypes.STRING(50)
  },
  { tableName: 'x_flow_fields' })
  FlowField.associate = function (models) {}
  return FlowField
}
