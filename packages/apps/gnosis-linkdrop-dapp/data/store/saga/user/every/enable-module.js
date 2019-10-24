import { put, select } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'
import { defineNetworkName } from '@linkdrop/commons'
import config from 'app.config.js'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'
console.log({ Web3 })

const generator = function * ({ payload }) {
  try {
    const sdk = yield select(generator.selectors.sdk)
    const safe = yield select(generator.selectors.safe)
    const data = yield sdk.getEnableLinkdropModuleData(safe)
    // const txHash = yield web3.eth.sendTransaction({ to: sdk.createAndAddModules, data }, { value: 0 })
    // console.log({ txHash })
    // yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId } })
    // yield put({ type: 'USER.SET_SDK', payload: { sdk } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  safe: ({ user: { safe } }) => safe
}
