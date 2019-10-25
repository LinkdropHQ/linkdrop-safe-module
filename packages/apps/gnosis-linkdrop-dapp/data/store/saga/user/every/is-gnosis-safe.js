import { select } from 'redux-saga/effects'

const generator = function * () {
  try {
    const sdk = yield select(generator.selectors.sdk)
    const safe = yield select(generator.selectors.safe)
    return yield sdk.isGnosisSafe(safe)
  } catch (e) {
    console.error('problem occured with method isGnosisSafe', e)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  safe: ({ user: { safe } }) => safe
}
