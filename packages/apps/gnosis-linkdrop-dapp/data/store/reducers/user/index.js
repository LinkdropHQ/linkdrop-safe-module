import reducers from './reducers'

const initialState = {
  id: undefined,
  locale: 'en',
  loading: false,
  errors: [],
  sdk: null,
  chainId: null,
  safe: null,
  setWalletConnector: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'USER.CHANGE_LOCALE': reducers.changeLocale,
  'USER.SET_LOADING': reducers.setLoading,
  'USER.SET_ERRORS': reducers.setErrors,
  'USER.SET_SDK': reducers.setSdk,
  'USER.SET_CHAIN_ID': reducers.setChainId,
  'USER.SET_SAFE': reducers.setSafe,
  'USER.SET_WALLET_CONNECTOR': reducers.setWalletConnector
}
