'use strict'
module.exports = (sequelize, DataTypes) => {
  const XLeadsList = sequelize.define('XLeadsList', {
    list_id: {
      type: DataTypes.BIGINT(14).UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    list_name: DataTypes.STRING(30),
    campaign_id: DataTypes.STRING(8),
    active: {
      type: DataTypes.ENUM,
      values: ['Y', 'N']
    },
    list_description: DataTypes.STRING,
    list_changedate: DataTypes.DATE,
    list_lastcalldate: DataTypes.DATE,
    reset_time: {
      type: DataTypes.STRING(512),
      defaultValue: ''
    },
    agent_script_override: {
      type: DataTypes.STRING(10),
      defaultValue: ''
    },
    campaign_cid_override: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    am_message_exten_override: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    drop_inbound_group_override: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    xferconf_a_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    xferconf_b_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    xferconf_c_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    xferconf_d_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    xferconf_e_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    web_form_address: {
      type: DataTypes.STRING(512),
      defaultValue: ''
    },
    web_form_address_two: {
      type: DataTypes.STRING(512),
      defaultValue: ''
    },
    time_zone_setting: {
      type: DataTypes.ENUM,
      values: ['COUNTRY_AND_AREA_CODE', 'POSTAL_CODE', 'NANPA_PREFIX', 'OWNER_TIME_ZONE_CODE'],
      defaultValue: 'COUNTRY_AND_AREA_CODE'
    },
    total_records: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0
    },
    flow_id: {
      allowNull: false,
      type: DataTypes.BIGINT(14).UNSIGNED,
      defaultValue: 0
    },
    list_startdate: {
      type: DataTypes.DATE,
      defaultValue: '1970-01-01 00:00:00'
    },
    list_stopdate: {
      type: DataTypes.DATE,
      defaultValue: '1970-01-01 00:00:00'
    }
  },
  {
    tableName: 'x_leads_lists',
    timestamps: false
  })
  XLeadsList.associate = function (models) {
  }
  return XLeadsList
}
