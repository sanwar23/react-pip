import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import { TextEncoder, TextDecoder } from 'util'
import ServiceBase from '../../common/serviceBase'
import config from '../../../config/app'
import logger from '../../common/logger'
import { getErrorMessageForService } from '../helper'

const constraints = {
  walletAddress: {
    presence: { allowEmpty: false }
  }
}

export default class CreateUserWalletService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const QBEACCOUNTNAME = 'qbe'
      const signatureProvider = new JsSignatureProvider([config.get('qbeCreatorPermission.qbe')])
      const rpc = new JsonRpc(config.get('qbeCreatorPermission.apinode'), { fetch })
      const eosApi = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

      const actions = [{
        account: 'eosio',
        name: 'newaccount',
        authorization: [{ actor: QBEACCOUNTNAME, permission: 'active' }],
        data: {
          creator: QBEACCOUNTNAME,
          name: this.walletAddress,
          owner: {
            threshold: 1,
            keys: [{ key: config.get('qbeCreatorPermission.owner'), weight: 1 }],
            accounts: [],
            waits: []
          },
          active: {
            threshold: 1,
            keys: [{ key: config.get('qbeCreatorPermission.owner'), weight: 1 }],
            accounts: [],
            waits: []
          }
        }
      }, {
        account: 'eosio',
        name: 'buyrambytes',
        authorization: [{ actor: QBEACCOUNTNAME, permission: 'active' }],
        data: {
          payer: QBEACCOUNTNAME,
          receiver: this.walletAddress,
          bytes: 3072
        }
      }, {
        account: 'eosio',
        name: 'delegatebw',
        authorization: [{ actor: QBEACCOUNTNAME, permission: 'active' }],
        data: {
          from: QBEACCOUNTNAME,
          receiver: this.walletAddress,
          stake_net_quantity: '0.0001 TLOS',
          stake_cpu_quantity: '0.0001 TLOS',
          transfer: false
        }
      }]

      await eosApi.transact({ actions: actions }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
    } catch (err) {
      logger.error(getErrorMessageForService('CreateUserWalletService'), err)
    }
  }
}
