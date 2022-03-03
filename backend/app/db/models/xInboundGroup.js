'use strict'
module.exports = (sequelize, DataTypes) => {
  const XInboundGroup = sequelize.define('XInboundGroup', {
    group_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    group_name: DataTypes.STRING(100),
    max_agent_calls: {
      type: DataTypes.SMALLINT(5),
      defaultValue: 0
    },
    active: {
      type: DataTypes.ENUM,
      values: ['Y', 'N']
    },
    web_form_address: {
      type: DataTypes.STRING(1024),
      defaultValue: ''
    },
    voicemail_ext: DataTypes.STRING(10),
    next_agent_call: {
      type: DataTypes.ENUM,
      values: ['random', 'oldest_call_start', 'oldest_call_finish', 'overall_user_level', 'inbound_group_rank', 'campaign_rank', 'fewest_calls', 'fewest_calls_campaign', 'longest_wait_time', 'ring_all'],
      defaultValue: 'longest_wait_time'
    },
    fronter_display: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    ingroup_script: DataTypes.STRING(10),
    get_call_launch: {
      type: DataTypes.ENUM,
      values: ['NONE', 'FLOW', 'SCRIPT', 'WEBFORM', 'WEBFORMTWO', 'FORM', 'EMAIL'],
      defaultValue: 'NONE'
    },
    xferconf_a_dtmf: DataTypes.STRING(50),
    xferconf_a_number: DataTypes.STRING(50),
    xferconf_b_dtmf: DataTypes.STRING(50),
    xferconf_b_number: DataTypes.STRING(50),
    drop_call_seconds: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      defaultValue: 360
    },
    drop_action: {
      type: DataTypes.ENUM,
      values: ['HANGUP', 'MESSAGE', 'VOICEMAIL', 'IN_GROUP', 'EXTENSION'],
      defaultValue: 'MESSAGE'
    },
    drop_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8307'
    },
    call_time_id: {
      type: DataTypes.STRING(20),
      defaultValue: '24hours'
    },
    after_hours_action: {
      type: DataTypes.ENUM,
      values: ['HANGUP', 'MESSAGE', 'EXTENSION', 'VOICEMAIL', 'IN_GROUP', 'CALLMENU'],
      defaultValue: 'MESSAGE'
    },
    after_hours_message_filename: {
      type: DataTypes.STRING,
      defaultValue: 'vm-goodbye'
    },
    after_hours_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8300'
    },
    after_hours_voicemail: DataTypes.STRING(20),
    welcome_message_filename: {
      type: DataTypes.STRING,
      defaultValue: '---NONE---'
    },
    moh_context: {
      type: DataTypes.STRING(50),
      defaultValue: 'default'
    },
    onhold_prompt_filename: {
      type: DataTypes.STRING,
      defaultValue: 'generic_hold'
    },
    prompt_interval: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      defaultValue: 60
    },
    agent_alert_exten: {
      type: DataTypes.STRING(100),
      defaultValue: 'ding'
    },
    agent_alert_delay: {
      type: DataTypes.INTEGER(6),
      defaultValue: 1000
    },
    default_xfer_group: {
      type: DataTypes.STRING(20),
      defaultValue: '---NONE---'
    },
    queue_priority: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0
    },
    drop_inbound_group: {
      type: DataTypes.STRING(20),
      defaultValue: '---NONE---'
    },
    ingroup_recording_override: {
      type: DataTypes.ENUM,
      values: ['DISABLED', 'NEVER', 'ONDEMAND', 'ALLCALLS', 'ALLFORCE'],
      defaultValue: 'DISABLED'
    },
    ingroup_rec_filename: {
      type: DataTypes.STRING(50),
      defaultValue: 'NONE'
    },
    afterhours_xfer_group: {
      type: DataTypes.STRING(20),
      defaultValue: '---NONE---'
    },
    qc_enabled: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    qc_statuses: {
      type: DataTypes.STRING(1024),
      defaultValue: ''
    },
    qc_shift_id: {
      type: DataTypes.STRING(20),
      defaultValue: '24HRMIDNIGHT'
    },
    qc_get_record_launch: {
      type: DataTypes.ENUM,
      values: ['NONE', 'SCRIPT', 'WEBFORM', 'QCSCRIPT', 'QCWEBFORM'],
      defaultValue: 'NONE'
    },
    qc_show_recording: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'Y'
    },
    qc_web_form_address: DataTypes.STRING,
    qc_script: DataTypes.STRING(10),
    play_place_in_line: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    play_estimate_hold_time: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    hold_time_option: {
      type: DataTypes.STRING(30),
      defaultValue: 'NONE'
    },
    hold_time_option_seconds: {
      type: DataTypes.INTEGER(5),
      defaultValue: 360
    },
    hold_time_option_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8300'
    },
    hold_time_option_voicemail: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    hold_time_option_xfer_group: {
      type: DataTypes.STRING(20),
      defaultValue: '---NONE---'
    },
    hold_time_option_callback_filename: {
      type: DataTypes.STRING,
      defaultValue: 'vm-hangup'
    },
    hold_time_option_callback_list_id: {
      type: DataTypes.BIGINT(14).UNSIGNED,
      defaultValue: 999
    },
    hold_recall_xfer_group: {
      type: DataTypes.STRING(20),
      defaultValue: '---NONE---'
    },
    no_delay_call_route: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    play_welcome_message: {
      type: DataTypes.ENUM,
      values: ['ALWAYS', 'NEVER', 'IF_WAIT_ONLY', 'YES_UNLESS_NODELAY'],
      defaultValue: 'ALWAYS'
    },
    answer_sec_pct_rt_stat_one: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      defaultValue: 20
    },
    answer_sec_pct_rt_stat_two: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      defaultValue: 30
    },
    default_group_alias: {
      type: DataTypes.STRING(30),
      defaultValue: ''
    },
    no_agent_no_queue: {
      type: DataTypes.ENUM,
      values: ['N', 'Y', 'NO_PAUSED'],
      defaultValue: 'N'
    },
    no_agent_action: {
      type: DataTypes.ENUM,
      values: ['CALLMENU', 'IN_GROUP', 'DID', 'MESSAGE', 'EXTENSION', 'VOICEMAIL', 'NONE'],
      defaultValue: 'NONE'
    },
    no_agent_action_value: {
      type: DataTypes.STRING,
      defaultValue: 'nbdy-avail-to-take-call|vm-goodbye'
    },
    web_form_address_two: {
      type: DataTypes.STRING(1024),
      defaultValue: ''
    },
    timer_action: {
      type: DataTypes.ENUM,
      values: ['NONE', 'WEBFORM', 'WEBFORM2', 'D1_DIAL', 'D2_DIAL', 'D3_DIAL', 'D4_DIAL', 'D5_DIAL', 'MESSAGE_ONLY', 'HANGUP', 'CALLMENU', 'EXTENSION', 'IN_GROUP'],
      defaultValue: 'NONE'
    },
    timer_action_message: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    timer_action_seconds: {
      type: DataTypes.INTEGER(7),
      defaultValue: -1
    },
    start_call_url: {
      type: DataTypes.STRING(1024),
      defaultValue: ''
    },
    dispo_call_url: {
      type: DataTypes.STRING(1024),
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
    ignore_list_script_override: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    extension_appended_cidname: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    uniqueid_status_display: {
      type: DataTypes.ENUM,
      values: ['DISABLED', 'ENABLED', 'ENABLED_PREFIX', 'ENABLED_PRESERVE'],
      defaultValue: 'DISABLED'
    },
    uniqueid_status_prefix: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    hold_time_option_minimum: {
      type: DataTypes.INTEGER(5),
      defaultValue: 0
    },
    hold_time_option_press_filename: {
      type: DataTypes.STRING,
      defaultValue: 'to-be-called-back|digits/1'
    },
    hold_time_option_callmenu: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    hold_time_option_no_block: {
      type: DataTypes.ENUM,
      values: ['N', 'Y'],
      defaultValue: 'N'
    },
    hold_time_option_prompt_seconds: {
      type: DataTypes.INTEGER(5),
      defaultValue: 10
    },
    onhold_prompt_no_block: {
      type: DataTypes.ENUM,
      values: ['N', 'Y'],
      defaultValue: 'N'
    },
    onhold_prompt_seconds: {
      type: DataTypes.INTEGER(5),
      defaultValue: 10
    },
    hold_time_second_option: {
      type: DataTypes.STRING(30),
      defaultValue: 'NONE'
    },
    hold_time_third_option: {
      type: DataTypes.STRING(30),
      defaultValue: 'NONE'
    },
    wait_hold_option_priority: {
      type: DataTypes.ENUM,
      values: ['WAIT', 'HOLD', 'BOTH'],
      defaultValue: 'WAIT'
    },
    wait_time_option: {
      type: DataTypes.STRING(30),
      defaultValue: 'NONE'
    },
    wait_time_second_option: {
      type: DataTypes.STRING(30),
      defaultValue: 'NONE'
    },
    wait_time_third_option: {
      type: DataTypes.STRING(30),
      defaultValue: 'NONE'
    },
    wait_time_option_seconds: {
      type: DataTypes.INTEGER(5),
      defaultValue: 120
    },
    wait_time_option_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8300'
    },
    wait_time_option_voicemail: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    wait_time_option_xfer_group: {
      type: DataTypes.STRING(20),
      defaultValue: '---NONE---'
    },
    wait_time_option_callmenu: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    wait_time_option_callback_filename: {
      type: DataTypes.STRING,
      defaultValue: 'vm-hangup'
    },
    wait_time_option_callback_list_id: {
      type: DataTypes.BIGINT(14).UNSIGNED,
      defaultValue: 999
    },
    wait_time_option_press_filename: {
      type: DataTypes.STRING,
      defaultValue: 'to-be-called-back|digits/1'
    },
    wait_time_option_no_block: {
      type: DataTypes.ENUM,
      values: ['N', 'Y'],
      defaultValue: 'N'
    },
    wait_time_option_prompt_seconds: {
      type: DataTypes.INTEGER(5),
      defaultValue: 10
    },
    timer_action_destination: {
      type: DataTypes.STRING(30),
      defaultValue: ''
    },
    calculate_estimated_hold_seconds: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      defaultValue: 0
    },
    add_lead_url: {
      type: DataTypes.STRING(1024),
      defaultValue: ''
    },
    eht_minimum_prompt_filename: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    eht_minimum_prompt_no_block: {
      type: DataTypes.ENUM,
      values: ['Y', 'N'],
      defaultValue: 'N'
    },
    eht_minimum_prompt_seconds: {
      type: DataTypes.INTEGER(5),
      defaultValue: 10
    },
    on_hook_ring_time: {
      type: DataTypes.INTEGER(5),
      defaultValue: 15
    },
    max_calls_in_queue: {
      type: DataTypes.SMALLINT(5),
      defaultValue: 0
    },
    max_calls_in_queue_filename: {
      type: DataTypes.STRING,
      defaultValue: '---NONE---'
    },
    campaign_id: {
      allowNull: false,
      type: DataTypes.STRING(8)
    },
    group_handling: {
      type: DataTypes.ENUM,
      values: ['PHONE', 'EMAIL'],
      defaultValue: 'PHONE'
    },
    max_calls_in_queue_action: {
      type: DataTypes.ENUM,
      values: ['HANGUP', 'MESSAGE', 'EXTENSION', 'VOICEMAIL', 'IN_GROUP'],
      defaultValue: 'HANGUP'
    },
    max_calls_in_queue_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8300'
    },
    max_calls_in_queue_voicemail: DataTypes.STRING(20),
    max_calls_in_queue_xfer_group: DataTypes.STRING(20),
    afterhours_callmenu: DataTypes.STRING(50)
  },
  {
    tableName: 'x_inbound_queues',
    timestamps: false
  })
  XInboundGroup.associate = function (models) {
  }
  return XInboundGroup
}
