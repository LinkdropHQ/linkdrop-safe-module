import React from 'react'
import styles from './styles.module'
import { actions, translate } from 'decorators'
import { Button, Input } from 'components/common'

@actions(({ claiming: { page, symbol, amount, icon } }) => ({
  page,
  symbol,
  amount,
  icon
}))
@translate('pages.claiming')
class SetAddress extends React.Component {
  render () {
    const { page, symbol, amount, icon } = this.props
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.toContinue')}</div>
      <div className={styles.subtitle}>{this.t('titles.useAddress')}</div>
      <Input className={styles.input} centered placeholder={this.t('titles.zeroXAddress')} />
      <Button
        className={styles.button}
      >
        {this.t('buttons.next')}
      </Button>
      <div
        className={styles.note}
        dangerouslySetInnerHTML={{ __html: this.t('texts.haveAnotherWallet') }}
      />
    </div>
  }
}

export default SetAddress
