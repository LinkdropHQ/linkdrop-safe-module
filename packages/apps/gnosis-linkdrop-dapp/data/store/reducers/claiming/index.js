import reducers from './reducers'

const initialState = {
  page: 'choose-wallet',
  icon: undefined,
  amount: 5,
  symbol: 'DAI'
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'CLAIMING.SET_PAGE': reducers.setPage,
  'CLAIMING.SET_ICON': reducers.setIcon,
  'CLAIMING.SET_SYMBOL': reducers.setSymbol,
  'CLAIMING.SET_AMOUNT': reducers.setAmount
}
