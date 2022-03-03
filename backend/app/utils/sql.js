import { sequelize } from '../db/models'
import logger from '../common/logger'

// Note: sequelize.QueryTypes
// sequelize.QueryTypes {
//   SELECT: 'SELECT',
//   INSERT: 'INSERT',
//   UPDATE: 'UPDATE',
//   BULKUPDATE: 'BULKUPDATE',
//   BULKDELETE: 'BULKDELETE',
//   DELETE: 'DELETE',
//   UPSERT: 'UPSERT',
//   VERSION: 'VERSION',
//   SHOWTABLES: 'SHOWTABLES',
//   SHOWINDEXES: 'SHOWINDEXES',
//   DESCRIBE: 'DESCRIBE',
//   RAW: 'RAW',
//   FOREIGNKEYS: 'FOREIGNKEYS',
//   SHOWCONSTRAINTS: 'SHOWCONSTRAINTS'
// }

export const SqlHelper = {
  select: async (queryString) => {
    logger.info(`Select query ${queryString}`)
    return sequelize.query(queryString,
      { raw: true, type: sequelize.QueryTypes.SELECT })
  },

  update: async (queryString) => {
    logger.info(`Update query ${queryString}`)
    return sequelize.query(queryString,
      { raw: true, type: sequelize.QueryTypes.UPDATE })
  },

  insert: async (queryString) => {
    logger.info(`Insert query ${queryString}`)
    return sequelize.query(queryString,
      { raw: true, type: sequelize.QueryTypes.INSERT })
  },

  delete: async (queryString) => {
    logger.info(`Delete query ${queryString}`)
    return sequelize.query(queryString,
      { raw: true, type: sequelize.QueryTypes.DELETE })
  },

  showTables: async (queryString) => {
    logger.info(`Show tables query ${queryString}`)
    return sequelize.query(queryString,
      { raw: true, type: sequelize.QueryTypes.SHOWTABLES })
  },

  // For reference : https://github.com/sequelize/sequelize/issues/959
  callProcedure: ({ procedure, replacements }) => {
    let query = { raw: true }
    if (replacements) {
      query = { replacements, ...query }
    }
    logger.info(`Procedure call ---> ${procedure} replacements ---> ${replacements}`)
    return sequelize.query(`CALL ${procedure}`, query)
  },

  runQuery: ({ query }) => {
    return new Promise((resolve, reject) => {
      // For reference: https://sequelize.readthedocs.io/en/latest/docs/raw-queries/
      try {
        sequelize.query(query).spread((results, metadata) => {
          resolve(results)
        })
      } catch (err) {
        logger.error(`Error while executing the method runQuery ====> ${err}`)
        reject(err)
      }
    })
  }
}
