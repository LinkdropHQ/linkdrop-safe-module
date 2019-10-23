import React from 'react'
import styles from './styles.module'
import { actions, translate } from 'decorators'
import { TokenIcon, Button } from 'components/common'

@actions(({ claiming: { page, symbol, amount, icon } }) => ({
  page,
  symbol,
  amount,
  icon
}))
@translate('pages.claiming')
class InitialPage extends React.Component {
  render () {
    const { page, symbol, amount, icon } = this.props
    return <div className={styles.container}>
      <TokenIcon />
      <div className={styles.title}>
        {amount} {symbol}
      </div>
      <Button
        className={styles.button}
      >
        {this.t('buttons.claim')}
      </Button>
      <div
        className={styles.note}
        dangerouslySetInnerHTML={{ __html: this.t('texts.note') }}
      />
    </div>
  }
}

export default InitialPage
