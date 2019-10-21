import LinkdropSDK from '@linkdrop/safe-module-sdk'

export default ({ linkdropMasterAddress, chain, jsonRpcUrl, apiHost, factoryAddress }) => new LinkdropSDK({
  linkdropMasterAddress,
  chain,
  jsonRpcUrl,
  apiHost,
  factoryAddress
})
