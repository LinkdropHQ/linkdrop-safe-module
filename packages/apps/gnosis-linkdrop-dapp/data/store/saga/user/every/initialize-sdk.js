import { put, select } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'
import { defineNetworkName } from '@linkdrop/commons'
import config from 'app.config.js'

const generator = function * () {
  try {
    const chainId = yield select(generator.selectors.chainId)
    const { infuraPk, apiHost, claimHost } = config
    const chain = defineNetworkName({ chainId })

    const sdk = initializeSdk({
      chain,
      jsonRpcUrl: `https://${chain}.infura.io/v3/${infuraPk}`,
      apiHost,
      claimHost
    })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}
