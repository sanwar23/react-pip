import { XLiveCall } from '../../db/models'

export const getCallByCallerId = async ({ callerid }) => {
  return XLiveCall.findOne({ where: { callerid }, raw: true })
}
