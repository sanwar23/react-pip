import config from '../../config/app'
import crypto from 'crypto'

export function isCheckrWebhook (req, res, next) {
  const checkrSignature = req.headers['x-checkr-signature']
  if (checkrSignature) {
    const apiKey = config.get('checkr.secretKey')
    const computedSignature = crypto.createHmac('sha256', apiKey).update(JSON.stringify(req.body)).digest('hex')
    if (checkrSignature === computedSignature) {
      next()
    } else return res.status(401).send('Invalid Signature')
  } else {
    return res.status(401).send('Unauthorized Request')
  }
}
