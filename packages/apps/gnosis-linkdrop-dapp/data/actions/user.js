class User {
  constructor (actions) {
    this.actions = actions
  }

  setLocale ({ locale }) {
    this.actions.dispatch({ type: 'USER.SET_LOCALE', payload: { locale } })
  }

  setWalletConnectData ({ chainId, accounts, walletConnector }) {
    this.actions.dispatch({ type: '*USER.SET_WALLET_CONNECT_DATA', payload: { chainId, accounts, walletConnector } })
  }

  enableModule () {
    this.actions.dispatch({ type: '*USER.ENABLE_MODULE' })
  }

  setStep ({ step }) {
    this.actions.dispatch({ type: 'USER.SET_STEP', payload: { step } })
  }

  setLoading ({ loading }) {
    this.actions.dispatch({ type: 'USER.SET_LOADING', payload: { loading } })
  }

  setErrors ({ errors }) {
    this.actions.dispatch({ type: 'USER.SET_ERRORS', payload: { errors } })
  }

  initializeSdk () {
    this.actions.dispatch({ type: '*USER.INITIALIZE_SDK' })
  }

  setChainId ({ chainId }) {
    this.actions.dispatch({ type: 'USER.SET_CHAIN_ID', payload: { chainId } })
  }
}

export default User
