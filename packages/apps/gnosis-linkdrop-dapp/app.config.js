/* global
  MASTER_COPY,
  INFURA_PK,
  FACTORY,
  DEFAULT_CHAIN_ID,
  CLAIM_HOST,
  API_HOST
*/

let config

try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const masterCopy = MASTER_COPY || String(config.masterCopy)
const factory = FACTORY || String(config.factory)
const infuraPk = INFURA_PK || String(config.infuraPk)
const claimHost = CLAIM_HOST || String(config.claimHost)
const defaultChainId = DEFAULT_CHAIN_ID || String(config.defaultChainId)
const apiHost = API_HOST || String(config.apiHost)

module.exports = {
  masterCopy,
  defaultChainId,
  factory,
  infuraPk,
  claimHost,
  apiHost
}
