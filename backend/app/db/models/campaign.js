'use strict'
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    campaign_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(8)
    },
    campaign_name: DataTypes.STRING(40),
    active: {
      type: DataTypes.ENUM,
      values: ['Y', 'N']
    },
    dial_status_a: DataTypes.STRING(6),
    dial_status_b: DataTypes.STRING(6),
    dial_status_c: DataTypes.STRING(15),
    dial_status_d: DataTypes.STRING(6),
    dial_status_e: DataTypes.STRING(10),
    lead_order: DataTypes.STRING(30),
    park_ext: DataTypes.STRING(10),
    park_file_name: {
      type: DataTypes.STRING(100),
      defaultValue: 'default'
    },
    web_form_address: {
      type: DataTypes.STRING(8000),
      defaultValue: ''
    },
    allow_closers: {
      type: DataTypes.ENUM,
      values: ['Y', 'N']
    },
    hopper_level: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      defaultValue: 1
    },
    auto_dial_level: {
      type: DataTypes.STRING(6),
      defaultValue: '0'
    },
    next_agent_call: {
      type: DataTypes.ENUM,
      values: [
        'random',
        'oldest_call_start',
        'oldest_call_finish',
        'campaign_rank',
        'overall_user_level',
        'fewest_calls',
        'longest_wait_time'
      ],
      defaultValue: 'longest_wait_time'
    },
    local_call_time: {
      type: DataTypes.STRING(10),
      defaultValue: '9am-9pm'
    },
    voicemail_ext: DataTypes.STRING(10),
    dial_timeout: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      defaultValue: 60
    },
    dial_prefix: {
      type: DataTypes.STRING(20),
      defaultValue: '9'
    },
    campaign_cid: {
      type: DataTypes.STRING(20),
      defaultValue: '0000000000'
    },
    campaign_vdad_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8368'
    },
    campaign_rec_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8309'
    },
    campaign_recording: {
      type: DataTypes.ENUM,
      values: [
        'NEVER',
        'ONDEMAND',
        'ALLCALLS',
        'ALLFORCE',
        'ALLPAUSE'
      ],
      defaultValue: 'ONDEMAND'
    },
    campaign_rec_filename: {
      type: DataTypes.STRING(50),
      defaultValue: 'FULLDATE_CUSTPHONE'
    },
    campaign_script: DataTypes.STRING(10),
    get_call_launch: {
      type: DataTypes.ENUM,
      values: [
        'NONE',
        'FLOW',
        'SCRIPT',
        'WEBFORM',
        'WEBFORMTWO',
        'FORM'
      ],
      defaultValue: 'NONE'
    },
    am_message_exten: {
      type: DataTypes.STRING(100),
      defaultValue: 'vm-goodbye'
    },
    amd_send_to_vmx: {
      type: DataTypes.ENUM,
      values: [
        'Y',
        'N',
        'ON_1ST_ATTEMPT',
        'ON_2ND_ATTEMPT'
      ],
      defaultValue: 'N'
    },
    xferconf_a_dtmf: DataTypes.STRING(50),
    xferconf_a_number: DataTypes.STRING(50),
    xferconf_b_dtmf: DataTypes.STRING(50),
    xferconf_b_number: DataTypes.STRING(50),
    alt_number_dialing: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    scheduled_callbacks: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    lead_filter_id: {
      type: DataTypes.STRING(10),
      defaultValue: 'NONE'
    },
    drop_call_seconds: {
      type: DataTypes.INTEGER(3),
      defaultValue: 5
    },
    drop_action: {
      type: DataTypes.ENUM,
      values: [
        'HANGUP',
        'MESSAGE',
        'VOICEMAIL',
        'IN_GROUP',
        'AUDIO',
        'CALLMENU'
      ],
      defaultValue: 'AUDIO'
    },
    safe_harbor_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8307'
    },
    display_dialable_count: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    wrapup_seconds: {
      type: DataTypes.INTEGER(3),
      defaultValue: 0
    },
    wrapup_message: {
      type: DataTypes.STRING,
      defaultValue: 'Wrapup Call'
    },
    closer_campaigns: {
      type: DataTypes.STRING(16000),
      defaultValue: ''
    },
    use_internal_dnc: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: [
        'Y',
        'N',
        'AREACODE'
      ]
    },
    allcalls_delay: {
      type: DataTypes.INTEGER(3),
      defaultValue: 0
    },
    omit_phone_code: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: [
        'Y',
        'N'
      ]
    },
    dial_method: {
      type: DataTypes.ENUM,
      values: [
        'MANUAL',
        'RATIO',
        'ADAPT_HARD_LIMIT',
        'ADAPT_TAPERED',
        'ADAPT_AVERAGE',
        'INBOUND_MAN'
      ],
      defaultValues: 'MANUAL'
    },
    available_only_ratio_tally: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: [
        'Y',
        'N'
      ]
    },
    adaptive_dropped_percentage: {
      type: DataTypes.STRING(4),
      defaultValue: '3'
    },
    adaptive_maximum_level: {
      type: DataTypes.STRING(6),
      defaultValue: '3.0'
    },
    adaptive_latest_server_time: {
      type: DataTypes.STRING(4),
      defaultValue: '2100'
    },
    adaptive_intensity: {
      type: DataTypes.STRING(6),
      defaultValue: '0'
    },
    adaptive_dl_diff_target: {
      type: DataTypes.INTEGER(3),
      defaultValue: '0'
    },
    concurrent_transfers: {
      type: DataTypes.ENUM,
      defaultValue: 'AUTO',
      values: [
        'AUTO', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '15', '20', '25', '30', '40', '50', '60', '80', '100'
      ]
    },
    auto_alt_dial: {
      type: DataTypes.ENUM,
      defaultValue: 'NONE',
      values: [
        'NONE', 'ALT_ONLY', 'ADDR3_ONLY', 'ALT_AND_ADDR3', 'ALT_AND_EXTENDED', 'ALT_AND_ADDR3_AND_EXTENDED', 'EXTENDED_ONLY', 'MULTI_LEAD'
      ]
    },
    auto_alt_dial_statuses: {
      type: DataTypes.STRING,
      defaultValue: ' B N NA DC -'
    },
    agent_pause_codes_active: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: [
        'Y', 'N', 'FORCE'
      ]
    },
    campaign_description: DataTypes.STRING,
    campaign_changedate: DataTypes.DATE,
    campaign_stats_refresh: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    campaign_logindate: DataTypes.DATE,
    dial_statuses: {
      type: DataTypes.STRING,
      defaultValue: ' NEW -'
    },
    disable_alter_custdata: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    no_hopper_leads_logins: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N', 'ALERT']
    },
    list_order_mix: {
      type: DataTypes.STRING(20),
      defaultValue: 'DISABLED'
    },
    campaign_allow_inbound: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    manual_dial_list_id: {
      type: DataTypes.BIGINT(14).UNSIGNED,
      defaultValue: 998
    },
    default_xfer_group: {
      type: DataTypes.STRING(100),
      defaultValue: '---NONE---'
    },
    xfer_groups: {
      type: DataTypes.STRING(16000),
      defaultValue: ''
    },
    queue_priority: {
      type: DataTypes.INTEGER(2),
      defaultValue: 50
    },
    drop_inbound_group: {
      type: DataTypes.STRING(100),
      defaultValue: '---NONE---'
    },
    qc_enabled: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    qc_statuses: {
      type: DataTypes.STRING(512),
      defaultValue: ''
    },
    qc_lists: DataTypes.STRING(512),
    qc_shift_id: {
      defaultValue: '24HRMIDNIGHT',
      type: DataTypes.STRING(20)
    },
    qc_get_record_launch: {
      type: DataTypes.ENUM,
      values: ['NONE', 'SCRIPT', 'WEBFORM', 'QCSCRIPT', 'QCWEBFORM'],
      defaultValue: 'NONE'
    },
    qc_show_recording: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    qc_web_form_address: DataTypes.STRING,
    qc_script: DataTypes.STRING(10),
    survey_first_audio_file: {
      defaultValue: 'US_pol_survey_hello',
      type: DataTypes.STRING(50)
    },
    survey_dtmf_digits: {
      defaultValue: '1238',
      type: DataTypes.STRING(16)
    },
    survey_ni_digit: {
      defaultValue: '8',
      type: DataTypes.STRING(1)
    },
    survey_opt_in_audio_file: {
      defaultValue: 'US_pol_survey_transfer',
      type: DataTypes.STRING(50)
    },
    survey_ni_audio_file: {
      defaultValue: 'US_thanks_no_contact',
      type: DataTypes.STRING(50)
    },
    survey_method: {
      type: DataTypes.ENUM,
      defaultValue: 'AGENT_XFER',
      values: [
        'AGENT_XFER',
        'VOICEMAIL',
        'EXTENSION',
        'HANGUP',
        'CAMPREC_60_WAV',
        'CALLMENU',
        'IN_GROUP'
      ]
    },
    survey_no_response_action: {
      type: DataTypes.ENUM,
      defaultValue: 'OPTIN',
      values: ['OPTIN', 'OPTOUT']
    },
    survey_ni_status: {
      type: DataTypes.STRING(6),
      defaultValue: 'NI'
    },
    survey_response_digit_map: {
      type: DataTypes.STRING,
      defaultValue: '1-DEMOCRAT|2-REPUBLICAN|3-INDEPENDANT|8-OPTOUT|X-NO RESPONSE|'
    },
    survey_xfer_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8300'
    },
    survey_camp_record_dir: {
      type: DataTypes.STRING,
      defaultValue: '/home/survey'
    },
    disable_alter_custphone: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N', 'HIDE']
    },
    display_queue_count: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    manual_dial_filter: {
      type: DataTypes.STRING(50),
      defaultValue: 'NONE'
    },
    agent_clipboard_copy: {
      type: DataTypes.STRING(50),
      defaultValue: 'NONE'
    },
    agent_extended_alt_dial: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    use_campaign_dnc: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N', 'AREACODE']
    },
    three_way_call_cid: {
      type: DataTypes.ENUM,
      defaultValue: 'CAMPAIGN',
      values: ['CAMPAIGN', 'CUSTOMER', 'AGENT_PHONE', 'AGENT_CHOOSE', 'CUSTOM_CID']
    },
    three_way_dial_prefix: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    web_form_target: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'vdcwebform'
    },
    vtiger_search_category: {
      defaultValue: 'LEAD',
      type: DataTypes.STRING(100)
    },
    vtiger_create_call_record: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N', 'DISPO']
    },
    vtiger_create_lead_record: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    vtiger_screen_login: {
      values: ['Y', 'N', 'NEW_WINDOW'],
      type: DataTypes.ENUM,
      defaultValue: 'Y'
    },
    cpd_amd_action: {
      values: ['DISABLED', 'DISPO', 'MESSAGE'],
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED'
    },
    agent_allow_group_alias: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    default_group_alias: {
      type: DataTypes.STRING(30),
      defaultValue: ''
    },
    vtiger_search_dead: {
      values: ['DISABLED', 'ASK', 'RESURRECT'],
      type: DataTypes.ENUM,
      defaultValue: 'ASK'
    },
    vtiger_status_call: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    survey_third_digit: {
      type: DataTypes.STRING(1),
      defaultValue: ''
    },
    survey_third_audio_file: {
      type: DataTypes.STRING(50),
      defaultValue: 'US_thanks_no_contact'
    },
    survey_third_status: {
      type: DataTypes.STRING(6),
      defaultValue: 'NI'
    },
    survey_third_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8300'
    },
    survey_fourth_digit: DataTypes.STRING(1),
    survey_fourth_audio_file: {
      type: DataTypes.STRING(50),
      defaultValue: 'US_thanks_no_contact'
    },
    survey_fourth_status: {
      type: DataTypes.STRING(6),
      defaultValue: 'NI'
    },
    survey_fourth_exten: {
      type: DataTypes.STRING(20),
      defaultValue: '8300'
    },
    drop_lockout_time: {
      type: DataTypes.STRING(6),
      defaultValue: '0'
    },
    quick_transfer_button: {
      type: DataTypes.STRING(20),
      defaultValue: 'N'
    },
    prepopulate_transfer_preset: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: [
        'N',
        'PRESET_1',
        'PRESET_2',
        'PRESET_3',
        'PRESET_4',
        'PRESET_5',
        'PRESET_6',
        'PRESET_7',
        'PRESET_8'
      ]
    },
    drop_rate_group: {
      type: DataTypes.STRING(100),
      defaultValue: 'DISABLED'
    },
    view_calls_in_queue: {
      values: ['NONE', 'ALL', '1', '2', '3', '4', '5'],
      defaultValue: 'NONE',
      type: DataTypes.ENUM
    },
    view_calls_in_queue_launch: {
      values: ['AUTO', 'MANUAL'],
      defaultValue: 'MANUAL',
      type: DataTypes.ENUM
    },
    grab_calls_in_queue: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    call_requeue_button: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    pause_after_each_call: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    no_hopper_dialing: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    agent_dial_owner_only: {
      type: DataTypes.ENUM,
      defaultValue: 'NONE',
      values: ['NONE', 'USER', 'TERRITORY', 'USER_GROUP']
    },
    agent_display_dialable_leads: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    web_form_address_two: {
      type: DataTypes.STRING(512),
      defaultValue: ''
    },
    waitforsilence_options: {
      type: DataTypes.STRING(25),
      defaultValue: ''
    },
    agent_select_territories: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    campaign_calldate: DataTypes.DATE,
    crm_popup_login: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N', 'IFRAME']
    },
    crm_login_address: {
      type: DataTypes.STRING(512),
      defaultValue: ''
    },
    timer_action: {
      type: DataTypes.ENUM,
      defaultValue: 'NONE',
      values: ['NONE', 'WEBFORM', 'WEBFORM2', 'D1_DIAL', 'D2_DIAL', 'D3_DIAL', 'D4_DIAL', 'D5_DIAL', 'MESSAGE_ONLY', 'HANGUP', 'CALLMENU', 'EXTENSION', 'IN_GROUP']
    },
    timer_action_message: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    timer_action_seconds: {
      type: DataTypes.MEDIUMINT(7),
      defaultValue: -1
    },
    start_call_url: {
      type: DataTypes.STRING(512),
      defaultValue: ''
    },
    dispo_call_url: {
      type: DataTypes.STRING(1000),
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
    use_custom_cid: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N', 'AREACODE']
    },
    scheduled_callbacks_alert: {
      type: DataTypes.ENUM,
      defaultValue: 'NONE',
      values: ['NONE', 'BLINK', 'RED', 'BLINK_RED', 'BLINK_DEFER', 'RED_DEFER', 'BLINK_RED_DEFER']
    },
    queuemetrics_callstatus_override: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'NO', 'YES']
    },
    extension_appended_cidname: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    scheduled_callbacks_count: {
      type: DataTypes.ENUM,
      defaultValue: 'ALL_ACTIVE',
      values: ['LIVE', 'ALL_ACTIVE']
    },
    manual_dial_override: {
      type: DataTypes.ENUM,
      defaultValue: 'NONE',
      values: ['NONE', 'ALLOW_ALL', 'DISABLE_ALL']
    },
    blind_monitor_warning: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'ALERT', 'NOTICE', 'AUDIO', 'ALERT_NOTICE', 'ALERT_AUDIO', 'NOTICE_AUDIO', 'ALL']
    },
    blind_monitor_message: {
      type: DataTypes.STRING,
      defaultValue: 'Someone is blind monitoring your session'
    },
    blind_monitor_filename: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    inbound_queue_no_dial: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'ENABLED', 'ALL_SERVERS']
    },
    timer_action_destination: {
      type: DataTypes.STRING(30),
      defaultValue: ''
    },
    enable_xfer_presets: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'ENABLED']
    },
    hide_xfer_number_to_dial: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'ENABLED']
    },
    manual_dial_prefix: {
      type: DataTypes.STRING(20),
      defaultValue: ''
    },
    customer_3way_hangup_logging: {
      type: DataTypes.ENUM,
      defaultValue: 'ENABLED',
      values: ['DISABLED', 'ENABLED']
    },
    customer_3way_hangup_seconds: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      defaultValue: 5
    },
    customer_3way_hangup_action: {
      type: DataTypes.ENUM,
      defaultValue: 'NONE',
      values: ['NONE', 'DISPO']
    },
    ivr_park_call: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'ENABLED', 'ENABLED_PARK_ONLY', 'ENABLED_BUTTON_HIDDEN']
    },
    ivr_park_call_agi: {
      type: DataTypes.STRING(512),
      defaultValue: ''
    },
    manual_preview_dial: {
      type: DataTypes.ENUM,
      defaultValue: 'PREVIEW_AND_SKIP',
      values: ['DISABLED', 'PREVIEW_AND_SKIP', 'PREVIEW_ONLY', 'FORCE_PREVIEW']
    },
    realtime_agent_time_stats: {
      type: DataTypes.ENUM,
      defaultValue: 'CALLS_WAIT_CUST_ACW_PAUSE',
      values: ['DISABLED', 'WAIT_CUST_ACW', 'WAIT_CUST_ACW_PAUSE', 'CALLS_WAIT_CUST_ACW_PAUSE']
    },
    use_auto_hopper: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    auto_hopper_multi: {
      type: DataTypes.STRING(6),
      defaultValue: '1'
    },
    auto_hopper_level: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    auto_trim_hopper: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    api_manual_dial: {
      type: DataTypes.ENUM,
      defaultValue: 'STANDARD',
      values: ['STANDARD', 'QUEUE', 'QUEUE_AND_AUTOCALL']
    },
    manual_dial_call_time_check: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'ENABLED']
    },
    display_leads_count: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    lead_order_randomize: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    lead_order_secondary: {
      type: DataTypes.ENUM,
      defaultValue: 'LEAD_ASCEND',
      values: ['LEAD_ASCEND', 'LEAD_DESCEND', 'CALLTIME_ASCEND', 'CALLTIME_DESCEND', 'CALLCOUNT_ASC', 'CALLCOUNT_DESC']
    },
    per_call_notes: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['ENABLED', 'DISABLED']
    },
    my_callback_option: {
      type: DataTypes.ENUM,
      defaultValue: 'UNCHECKED',
      values: ['CHECKED', 'UNCHECKED']
    },
    agent_lead_search: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['ENABLED', 'DISABLED', 'LIVE_CALL_INBOUND', 'LIVE_CALL_INBOUND_MANUAL']
    },
    agent_lead_search_method: {
      type: DataTypes.STRING(30),
      defaultValue: 'CAMPLISTS_ALL'
    },
    queuemetrics_phone_environment: DataTypes.STRING(50),
    auto_pause_precall: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    auto_pause_precall_code: {
      type: DataTypes.STRING(6),
      defaultValue: 'PRECAL'
    },
    auto_resume_precall: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    manual_dial_cid: {
      type: DataTypes.ENUM,
      defaultValue: 'CAMPAIGN',
      values: ['CAMPAIGN', 'AGENT_PHONE']
    },
    post_phone_time_diff_alert: {
      type: DataTypes.STRING(30),
      defaultValue: 'DISABLED'
    },
    custom_3way_button_transfer: {
      type: DataTypes.STRING(30),
      defaultValue: 'DISABLED'
    },
    available_only_tally_threshold: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'LOGGED-IN_AGENTS', 'NON-PAUSED_AGENTS', 'WAITING_AGENTS']
    },
    available_only_tally_threshold_agents: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      defaultValue: 0
    },
    dial_level_threshold: {
      type: DataTypes.ENUM,
      defaultValue: 'DISABLED',
      values: ['DISABLED', 'LOGGED-IN_AGENTS', 'NON-PAUSED_AGENTS', 'WAITING_AGENTS']
    },
    dial_level_threshold_agents: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      defaultValue: 0
    },
    safe_harbor_audio: {
      type: DataTypes.STRING(100),
      defaultValue: 'buzz'
    },
    safe_harbor_menu_id: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    survey_menu_id: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    callback_days_limit: {
      type: DataTypes.SMALLINT(3),
      defaultValue: 0
    },
    dl_diff_target_method: {
      type: DataTypes.ENUM,
      defaultValue: 'ADAPT_CALC_ONLY',
      values: ['ADAPT_CALC_ONLY', 'CALLS_PLACED']
    },
    end_call_action: {
      type: DataTypes.STRING(20),
      defaultValue: 'N'
    },
    allow_emails: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    lookuplead_manual_dial_option: {
      type: DataTypes.ENUM,
      defaultValue: 'UNCHECKED',
      values: ['CHECKED', 'UNCHECKED']
    },
    campaign_allow_livechat: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    custom_status_only: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N', 'ALL']
    },
    screen_recording_enabled: {
      type: DataTypes.ENUM,
      defaultValue: 'N',
      values: ['Y', 'N']
    },
    xferconf_f_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    xferconf_g_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    xferconf_h_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    show_called_count: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_avg_talk_time: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_avg_wait_time: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_call_log_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_volume_control_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_send_dtmf_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_view_agents_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_play_message_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_manual_record_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_contact_information_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_interaction_script_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_email_details_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_interaction_form_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_dial_next_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_inbound_queues_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_pause_codes_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_web_form_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_flow_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    show_dispo_call_button: {
      type: DataTypes.ENUM,
      defaultValue: 'Y',
      values: ['Y', 'N']
    },
    survey_queue: DataTypes.STRING(45),
    preview_seconds: {
      type: DataTypes.SMALLINT(3).UNSIGNED,
      defaultValue: 0
    }
  },
  { tableName: 'x_campaigns' })
  Campaign.associate = function (models) {}
  return Campaign
}
