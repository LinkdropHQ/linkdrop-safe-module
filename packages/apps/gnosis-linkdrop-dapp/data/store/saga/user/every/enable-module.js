import { put, select } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'
import { defineNetworkName } from '@linkdrop/commons'
import config from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const safe = yield select(generator.selectors.safe)
    const { data } = yield sdk.getEnableLinkdropModuleData(safe)
    const walletConnector = yield select(generator.selectors.walletConnector)
    const tx = {
      from: safe,
      to: sdk.createAndAddModules,
      data
    }

    const txHash = yield walletConnector.sendTransaction(tx)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  safe: ({ user: { safe } }) => safe,
  walletConnector: ({ user: { walletConnector } }) => walletConnector
}
