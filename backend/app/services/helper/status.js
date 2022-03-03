import { XStatus } from '../../db/models'

// queryObj can be any field defined in the XStatus model
export const getStatuses = (queryObj) => {
  const query = { raw: true }
  if (queryObj) {
    query['where'] = queryObj
  }
  return XStatus.findAll(query)
}
