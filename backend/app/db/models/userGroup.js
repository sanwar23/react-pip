'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
    user_group: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    group_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    allowed_campaigns: DataTypes.TEXT,
    qc_allowed_campaigns: DataTypes.TEXT,
    qc_allowed_inbound_groups: DataTypes.TEXT,
    group_shifts: DataTypes.TEXT,
    forced_timeclock_login: {
      type: DataTypes.ENUM,
      values: ['Y', 'N', 'ADMIN_EXEMPT'],
      defaultValue: 'N'
    },
    shift_enforcement: {
      type: DataTypes.ENUM,
      values: ['OFF', 'START', 'ALL'],
      defaultValue: 'OFF'
    },
    agent_status_viewable_groups: DataTypes.TEXT,
    agent_status_view_time: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    agent_call_log_view: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    agent_xfer_consultative: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    agent_xfer_dial_override: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    agent_xfer_vm_transfer: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    agent_xfer_blind_transfer: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    agent_xfer_dial_with_customer: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    agent_xfer_park_customer_dial: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    agent_fullscreen: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    allowed_reports: {
      type: DataTypes.STRING(2000),
      defaultValue: 'ALL REPORTS'
    },
    webphone_url_override: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    webphone_systemkey_override: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    webphone_dialpad_override: {
      type: DataTypes.ENUM,
      values: ['DISABLED', 'Y', 'N', 'TOGGLE', 'TOGGLE_OFF'],
      defaultValue: 'DISABLED'
    },
    allow_livechat: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    }
  },
  {
    tableName: 'x_user_groups'
  })
  UserGroup.associate = function (models) {
  }
  return UserGroup
}
