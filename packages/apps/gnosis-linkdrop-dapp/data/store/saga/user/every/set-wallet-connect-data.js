/* global web3 */
import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import initializeSdk from 'data/sdk'
import { defineNetworkName, defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const { chainId, accounts } = payload
    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId } })
    yield put({ type: 'USER.SET_CURRENT_ACCOUNT', payload: { account: accounts[0] } })
    if (chainId && accounts && accounts[0]) {
      window.location.href = '/#/activate'
    }

    // window.addressChangeInterval && window.clearInterval(window.addressChangeInterval)
    // const networkName = defineNetworkName({ chainId: networkVersion })
    // const jsonRpcUrl = defineJsonRpcUrl({ chainId: networkVersion, infuraPk, jsonRpcUrlXdai })
    // const sdk = initializeSdk({
    //   claimHost,
    //   factoryAddress: factory,
    //   chainId: networkName,
    //   linkdropMasterAddress: selectedAddress,
    //   jsonRpcUrl,
    //   apiHost: `https://${networkName}.linkdrop.io`
    // })
    // yield put({ type: 'USER.SET_SDK', payload: { sdk } })
    // yield put({ type: 'USER.SET_CURRENT_ADDRESS', payload: { currentAddress: selectedAddress } })
    // yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId: networkVersion } })
    // yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    // window.addressChangeInterval = window.setInterval(() => {
    //   const currentMetamaskAddress = web3.eth.accounts[0]
    //   if (selectedAddress !== currentMetamaskAddress) {
    //     window.location.reload()
    //   }
    // }, 2000)
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
