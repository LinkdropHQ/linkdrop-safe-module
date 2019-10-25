import { put, select } from 'redux-saga/effects'
import isLinkdropModuleEnabled from './is-linkdrop-module-enabled'
import initializeSdk from './initialize-sdk'
import isGnosisSafe from './is-gnosis-safe'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { chainId, accounts, walletConnector } = payload
    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId } })
    yield put({ type: 'USER.SET_SAFE', payload: { safe: accounts[0] } })
    yield put({ type: 'USER.SET_WALLET_CONNECTOR', payload: { walletConnector } })
    const sdk = yield select(generator.selectors.sdk)
    // if no arguments passed  - then just set values to default and return
    if (!chainId || !accounts || !accounts[0]) {
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    // if no sdk - create it
    if (!sdk) {
      yield initializeSdk()
    }

    // if address is not gnosis safe - show error
    const isSafe = yield isGnosisSafe()
    if (!isSafe) {
      throw new Error('Address passed as argument is not a Gnosis safe')
    }

    // if module was enabled previously - go to create link-page. if not - activate page
    const isModuleEnabled = yield isLinkdropModuleEnabled()
    if (chainId && accounts && accounts[0]) {
      if (isModuleEnabled) {
        window.location.href = '/#/create-link'
      } else {
        window.location.href = '/#/activate'
      }
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk
}
