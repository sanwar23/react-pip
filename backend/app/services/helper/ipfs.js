import IpfsHttpClient from 'ipfs-http-client'
import config from '../../../config/app'

const IPFS_PROTOCOL = config.get('ipfs.protocol')
const IPFS_HOST = config.get('ipfs.host')

const ipfs = IpfsHttpClient({
  host: IPFS_HOST,
  port: config.get('ipfs.port'),
  protocol: IPFS_PROTOCOL
})

export const uploadFileToIPFS = async (fileContent) => {
  const response = await ipfs.add(fileContent)
  return `${IPFS_PROTOCOL}://${IPFS_HOST}/ipfs/${response.cid}`
}
