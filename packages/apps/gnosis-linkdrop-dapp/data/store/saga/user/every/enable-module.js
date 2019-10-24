import { put, select } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'
import { defineNetworkName } from '@linkdrop/commons'
import config from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const sdk = yield select(generator.selectors.sdk)
    const safe = yield select(generator.selectors.safe)
    console.log({ safe })
    const enableData = yield sdk.getEnableLinkdropModuleData(safe)

    console.log({ enableData })

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
