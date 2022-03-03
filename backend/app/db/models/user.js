'use strict'
import bcrypt from 'bcrypt'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(9)
    },
    facebook_id: DataTypes.STRING,
    twitter_id: DataTypes.STRING,
    linkedin_id: DataTypes.STRING,
    user: {
      type: DataTypes.STRING(100),
      unique: 'User_user_unique',
      allowNull: false
    },
    pass: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    full_name: DataTypes.STRING(100),
    user_level: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    user_group: DataTypes.STRING(20),
    phone_login: DataTypes.STRING(20),
    phone_pass: DataTypes.STRING(20),
    delete_users: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    delete_user_groups: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    delete_lists: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    delete_campaigns: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    delete_ingroups: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    delete_remote_agents: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    load_leads: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    campaign_detail: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    ast_admin_access: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    ast_delete_phones: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    delete_scripts: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_leads: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    hotkeys_active: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    change_agent_campaign: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    agent_choose_ingroups: {
      type: DataTypes.ENUM,
      defaultValue: '1',
      values: ['0', '1']
    },
    closer_campaigns: {
      type: DataTypes.STRING(16000),
      defaultValue: ''
    },
    scheduled_callbacks: {
      type: DataTypes.ENUM,
      defaultValue: '1',
      values: ['0', '1']
    },
    agentonly_callbacks: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    agentcall_manual: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    vicidial_recording: {
      type: DataTypes.ENUM,
      defaultValue: '1',
      values: ['0', '1']
    },
    vicidial_transfers: {
      type: DataTypes.ENUM,
      defaultValue: '1',
      values: ['0', '1']
    },
    delete_filters: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    alter_agent_interface_options: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    closer_default_blended: {
      type: DataTypes.ENUM,
      defaultValue: '1',
      values: ['0', '1']
    },
    delete_call_times: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_call_times: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_users: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_campaigns: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_lists: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_scripts: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_filters: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_ingroups: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_usergroups: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_remoteagents: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_servers: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    view_reports: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    vicidial_recording_override: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'NEVER', 'ONDEMAND', 'ALLCALLS', 'ALLFORCE']
    },
    alter_custdata_override: {
      type: DataTypes.ENUM,
      defaultValue: 'NOT_ACTIVE',
      values: ['NOT_ACTIVE', 'ALLOW_ALTER']
    },
    qc_enabled: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    qc_user_level: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1
    },
    qc_pass: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    qc_finish: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    qc_commit: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    add_timeclock_log: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    modify_timeclock_log: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    delete_timeclock_log: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    alter_custphone_override: {
      type: DataTypes.ENUM,
      defaultValue: 'NOT_ACTIVE',
      values: ['NOT_ACTIVE', 'ALLOW_ALTER']
    },
    vdc_agent_api_access: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_inbound_dids: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    delete_inbound_dids: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    active: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    alert_enabled: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    download_lists: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    agent_shift_enforcement_override: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'OFF', 'START', 'ALL']
    },
    manager_shift_enforcement_override: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    shift_override_flag: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    export_reports: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    delete_from_dnc: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    email: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    email_verified: DataTypes.BOOLEAN,
    user_code: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    territory: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    allow_alerts: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    agent_choose_territories: {
      type: DataTypes.ENUM,
      defaultValue: '1',
      values: ['0', '1']
    },
    custom_one: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    custom_two: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    custom_three: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    custom_four: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    custom_five: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    voicemail_id: {
      type: DataTypes.STRING(10),
      defaultValue: ''
    },
    agent_call_log_view_override: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'Y', 'N']
    },
    callcard_admin: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['1', '0']
    },
    agent_choose_blended: {
      type: DataTypes.ENUM,
      defaultValue: '1',
      values: ['0', '1']
    },
    realtime_block_user_info: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    custom_fields_modify: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    force_change_password: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    agent_lead_search_override: {
      type: DataTypes.ENUM,
      defaultValue: 'NOT_ACTIVE',
      values: ['NOT_ACTIVE', 'ENABLED', 'DISABLED']
    },
    agentcall_email: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    },
    modify_email_accounts: {
      type: DataTypes.ENUM,
      defaultValue: '0',
      values: ['0', '1']
    }
  },
  { tableName: 'x_users' })

  User.prototype.comparePassword = async function (password) {
    if (!password) {
      return false
    }
    const result = await bcrypt.compare(password, this.pass)
    return result
  }
  return User
}
