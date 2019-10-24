import { takeEvery } from 'redux-saga/effects'

import initializeSdk from './every/initialize-sdk'
import setWalletConnectData from './every/set-wallet-connect-data'
import enableModule from './every/enable-module'

export default function * () {
  yield takeEvery('*USER.INITIALIZE_SDK', initializeSdk)
  yield takeEvery('*USER.SET_WALLET_CONNECT_DATA', setWalletConnectData)
  yield takeEvery('*USER.ENABLE_MODULE', enableModule)
}
