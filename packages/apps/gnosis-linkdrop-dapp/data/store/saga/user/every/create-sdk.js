import { put, select } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'
import { defineNetworkName } from '@linkdrop/commons'
import config from 'app.config.js'
import { getApiHost, getApiHostWallet } from 'helpers'

const generator = function * ({ payload }) {
  try {
    const { linkdropMasterAddress } = payload
    const chainId = yield select(generator.selectors.chainId)
    const { factory, infuraPk } = config
    const networkName = defineNetworkName({ chainId })
    const apiHost = getApiHostWallet({ chainId })
    const sdk = initializeSdk({
      chain: networkName,
      infuraPk: config.infuraPk,
      apiHost
    })

    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId } })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}
