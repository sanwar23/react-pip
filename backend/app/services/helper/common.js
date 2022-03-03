import { USER_LEVEL } from '../../services/user/getSecurityContext'
import config from '../../../config/app'
import { SqlHelper } from '../../utils/sql'
import _ from 'lodash'
import moment from 'moment'
import { executeUpdateQuery } from '../../utils/queryManager'
import logger from '../../common/logger'

// Here we are separating the combined values
// Input example: ' AGENTDIRECT LeadCrowdInbound NewTFNInboundQueue UveaousTechInbound -'
export const splitCombinedFieldValuesForGroup = (combinedFieldValues) => {
  let values = combinedFieldValues && combinedFieldValues.split(' ')
  if (values && values.length) {
    values = values.filter((value) => {
      const str = value.trim()
      return (str !== '-' && str !== '')
    })
  }
  return values
}

export const createNewEntity = async ({ model, data }) => {
  const dataValues = await model.create(data)
  return dataValues.get({ plain: true })
}

export const updateEntity = async ({ model, data }) => {
  return executeUpdateQuery({
    method: 'update',
    model,
    data
  })
}

export const generateUUID = () => {
  let time = new Date().getTime()
  // Generating 16 digits long random id
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const number = (time + Math.random() * 16) % 16 | 0
    time = Math.floor(time / 16)
    return (c === 'x' ? number : (number & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

export const isAuthorizedForClient = ({ clients, client_id, user_level }) => {
  let isClientIdMatched = false
  // here we're checking if client_id matches with any clients client_id or not
  for (let index = 0; index < clients.length; index++) {
    if (clients[index].client_id === client_id) {
      isClientIdMatched = true
      break
    }
  }

  // user must be part of client or be a system user to be authorized for client
  return (isClientIdMatched || user_level === USER_LEVEL.SYSTEM)
}

export const listsFieldsColumnExists = async ({ list_id, columnName }) => {
  const dbName = config.get('sequelize.name')
  const sql = `SELECT * from INFORMATION_SCHEMA.COLUMNS \
              WHERE TABLE_SCHEMA = '${dbName}' AND \
              TABLE_NAME='x_leads_custom_${list_id}' AND \
              COLUMN_NAME='${columnName}' LIMIT 1;`

  const data = await SqlHelper.select(sql)
  const isColumnExist = !_.isEmpty(data)
  return isColumnExist
}

export const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export const formatDatePrecisely = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss.SSS')
}

export const isSameDate = (firstDate, secondDate) => {
  return moment(firstDate).isSame(secondDate)
}

export const getFirstElement = (input) => {
  const isArray = Object.prototype.toString.call(input) === '[object Array]'
  return (isArray && input[0]) || ''
}

export const getArchiveTableName = (model) => {
  return `${model.tableName}_archive`
}

export const getHistoricalTableName = (model) => {
  return `${model.tableName}_historical`
}

export const getErrorMessageForService = (serviceName) => {
  return `Error while executing the service ${serviceName} =====>`
}

export const displayErrorMessageForMethod = (methodName, error) => {
  return logger.error(`Error while executing the method ${methodName} =====> ${error}`)
}

export const getErrorMessageForSocket = (event) => {
  return `Socket : Error while ${event} =====>`
}

export const displayLoggerMessageForSocket = (event, value) => {
  return logger.info(`Socket : ${event} =====> ${value}`)
}

export const createDate = ({ year, month, day, hours, minutes, seconds }) => {
  return moment(`${month}/${day}/${year} ${hours}:${minutes}:${seconds}`, 'MM/DD/YYYY HH:mm:ss A')
}

export const fixDigits = (input, digit) => {
  return Number(parseFloat(input)).toFixed(digit)
}

// This method works same as class System.Dynamic.ExpandoObject()
// For Example:
// input = {name: 'example'}
// output = [{Key: 'name', Value: 'example'}]
export const expandoObject = (input) => {
  const customData = []
  for (const property in input) {
    customData.push(
      {
        Key: property,
        Value: input[property]
      }
    )
  }

  return customData
}

// This method is used for flat the array (one level).
// For Example:
// input: [[{name: 'abc'}], [{name: 'xyz'}], {}, {}]
// output: [{name: 'abc'}, {name: 'xyz'}]
export const flatArray = (input) => {
  let flatFilteredArray = []
  input.forEach((data) => {
    if (!_.isEmpty(data)) {
      flatFilteredArray = [...flatFilteredArray, ...data]
    }
  })

  return flatFilteredArray
}

export const validateImageFile = ({ mimetype, size }) => {
  const isValidImage = config.get('imageFileFormats').includes(mimetype)
  const isValidFileSize = size <= config.get('imageFileSize')
  return { isValidImage, isValidFileSize }
}

export const validateVideoFile = ({ mimetype, size }) => {
  const isValidVideo = config.get('videoFileFormats').includes(mimetype)
  const isValidFileSize = size <= config.get('videoFileSize')
  return { isValidVideo, isValidFileSize }
}

export const validateAudioFile = ({ mimetype, size }) => {
  const isValidAudio = config.get('audioFileFormats').includes(mimetype)
  const isValidFileSize = size <= config.get('audioFileSize')
  return { isValidAudio, isValidFileSize }
}

// This method is used for checking countries whose country code is '+1' e.g. U.S. or Canada
export const checkSpecificCountry = (phone_number) => {
  const countryCode = phone_number.split(' ')[0]
  return countryCode === '+1'
}

// This method is used for showing number saved in db to user as per format +1 5555555555
export const phoneNumberFormatter = (phone_number) => {
  return `+${phone_number}`
}

// This method is used for Async forEach operation
export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

// This method is used to generate chat room Id
export const formatConversationRoomId = (conversationId) => {
  return `c-${conversationId}`
}

// This method is used to get conversation id from chat room Id
export const getConversationIdFromRoomId = (roomId) => {
  return parseInt(roomId.slice(2))
}
