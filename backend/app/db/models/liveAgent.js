'use strict'
module.exports = (sequelize, DataTypes) => {
  const LiveAgent = sequelize.define('LiveAgent', {
    live_agent_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(9).UNSIGNED
    },
    user: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(100)
    },
    server_ip: {
      allowNull: false,
      type: DataTypes.STRING(15)
    },
    conf_exten: DataTypes.STRING(20),
    extension: DataTypes.STRING(100),
    status: {
      type: DataTypes.ENUM,
      values: ['READY', 'QUEUE', 'INCALL', 'PAUSED', 'CLOSER', 'MQUEUE'],
      defaultValue: 'PAUSED'
    },
    lead_id: {
      allowNull: false,
      type: DataTypes.INTEGER(9).UNSIGNED
    },
    campaign_id: DataTypes.STRING(8),
    uniqueid: DataTypes.STRING(20),
    callerid: DataTypes.STRING(20),
    channel: DataTypes.STRING(100),
    random_id: DataTypes.INTEGER(8).UNSIGNED,
    last_call_time: DataTypes.DATE,
    last_update_time: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    last_call_finish: DataTypes.DATE,
    closer_campaigns: DataTypes.STRING(16000),
    call_server_ip: DataTypes.STRING(15),
    user_level: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0
    },
    comments: DataTypes.STRING(20),
    campaign_weight: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    calls_today: {
      type: DataTypes.SMALLINT(5).UNSIGNED,
      defaultValue: 0
    },
    external_hangup: {
      type: DataTypes.STRING(1),
      defaultValue: ''
    },
    external_status: {
      type: DataTypes.STRING(6),
      defaultValue: ''
    },
    external_pause: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    external_dial: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    external_ingroups: DataTypes.STRING(4000),
    external_blended: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      defaultValue: '0'
    },
    external_igb_set_user: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    external_update_fields: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      defaultValue: '0'
    },
    external_update_fields_data: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    external_timer_action: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    external_timer_action_message: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    external_timer_action_seconds: {
      type: DataTypes.MEDIUMINT(7),
      defaultValue: -1
    },
    agent_log_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      defaultValue: 0
    },
    last_state_change: DataTypes.DATE,
    agent_territories: DataTypes.STRING(25),
    outbound_autodial: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    manager_ingroup_set: {
      type: DataTypes.ENUM,
      values: ['Y', 'N', 'SET'],
      defaultValue: 'N'
    },
    ra_user: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    ra_extension: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    external_dtmf: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    external_transferconf: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    external_park: {
      type: DataTypes.STRING(40),
      defaultValue: ''
    },
    external_timer_action_destination: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    on_hook_agent: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    on_hook_ring_time: {
      type: DataTypes.SMALLINT(15),
      defaultValue: 15
    },
    ring_callerid: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    }
  },
  { tableName: 'x_live_agents' })
  LiveAgent.associate = function (models) {}
  return LiveAgent
}
