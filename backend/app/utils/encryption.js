import crypto from 'crypto'
import config from '../../config/app'

const vector = Buffer.from(config.get('encryption.initialization_vector'), 'hex')
const key = Buffer.from(config.get('encryption.initialization_key'), 'hex')
const algorithm = config.get('encryption.algorithm')

export const encryptData = (text) => {
  const cipherText = crypto.createCipheriv(algorithm, key, vector)
  let encryptedData = cipherText.update(text, 'utf8', 'base64')
  encryptedData += cipherText.final('base64')
  return encryptedData
}

export const decryptData = (encryptedData) => {
  const decipherText = crypto.createDecipheriv(algorithm, key, vector)
  const decrypted = decipherText.update(encryptedData, 'base64', 'utf8')
  return (decrypted + decipherText.final('utf8'))
}
