import { takeEvery } from 'redux-saga/effects'

import createSdk from './every/create-sdk'
import setWalletConnectData from './every/set-wallet-connect-data'

export default function * () {
  yield takeEvery('*USER.CREATE_SDK', createSdk)
  yield takeEvery('*USER.SET_WALLET_CONNECT_DATA', setWalletConnectData)
}
