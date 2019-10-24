import SDK from '@linkdrop/safe-module-sdk'

export default ({ chain, jsonRpcUrl, apiHost, claimHost }) => {
  return new SDK({
    chain,
    apiHost,
    claimHost,
    jsonRpcUrl
  })
}
