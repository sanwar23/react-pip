export const SUCCESS_MESSAGES = {
  LOGOUT: 'User logged out successfully!',
  VERIFY_TOKEN: 'Token verified successfully, Access token granted!',
  SEND_VERIFICATION_EMAIL: 'Email Verification mail sent successfully! ',
  HANDLE_CHECKR_EVENT: 'Checkr event handled successfully!',
  SEND_FORGET_PASSWORD_EMAIL: 'Reset forget password mail sent successfully! ',
  PASSWORD_UPDATED_SUCCESSFULLY: 'Password updated succesfully'
}

export const CONSTANTS = {
  FORGET_PASSWORD_TOKEN_TYPE: 'forgetPassword',
  VERIFY_EMAIL_TOKEN_TYPE: 'verifyEmail',
  RESET_EMAIL_TOKEN_TYPE: 'resetEmail',
  ADD_ENDORSE: 'ADD_ENDORSE',
  REMOVE_ENDORSE: 'REMOVE_ENDORSE',
  SKILLS: 'SKILLS'
}

export const EVENTS = {
  JOIN_ROOM: 'join-room',
  SEND_NOTIFICATION: 'send-notification',
  RECEIVE_NOTIFICATION: 'receive-notification',
  DELETE_NOTIFICATION: 'delete-notification',
  REMOVE_NOTIFICATION: 'remove-notification',
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'receive-message',
  JOIN_CHAT_ROOM: 'join-chat-room',
  LEAVE_CHAT_ROOM: 'leave-chat-room',
  JOIN_CHAT_ROOM_FOR_OTHER_USERS: 'join-chat-room-for-other-users',
  LEAVE_CHAT_ROOM_FOR_OTHER_USER: 'leave-chat-room-for-other-user',
  LEAVE_CHAT_ROOM_FOR_SELF: 'leave-chat-room-for-self',
  SEND_MESSAGE_TO_ROOM: 'send-message-to-room',
  SEND_MESSAGE_ERROR: 'send-message-error',
  START_TYPING: 'start-typing',
  STOP_TYPING: 'stop-typing',
  AUTHENTICATION_FAILURE: 'authentication-failure'
}
