import _ from 'lodash'

export const getOne = async ({ model, data = {}, attributes = [] }) => {
  let query = { raw: true, where: data }
  if (!_.isEmpty(attributes)) {
    query = { ...query, attributes }
  }
  return model.findOne(query)
}

export const getAll = async ({ model, data = {}, attributes = [] }) => {
  let query = { raw: true, where: data }
  if (!_.isEmpty(attributes)) {
    query = { ...query, attributes }
  }
  return model.findAll(query)
}

export const getModelKeys = async ({ model }) => {
  return Object.keys(await model.describe())
}

export const getModelPrimaryKeys = async ({ model }) => {
  const modelKeysObject = await model.describe()
  return Object.keys(modelKeysObject).filter(key => modelKeysObject[key].primaryKey)
}

export const aggregate = async ({ model, aggFunction, data }) => {
  const query = { raw: true, where: { is_deleted: false, ...data } }
  let res
  switch (aggFunction) {
    case 'count':
      res = await model.count(query)
  }
  return res
}
