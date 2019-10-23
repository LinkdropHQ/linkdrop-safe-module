import React from 'react'
import { Page } from 'components/pages'
import { translate } from 'decorators'
import styles from './styles.module'
import WalletConnect from './wallet-connect'

@translate('pages.connect')
class Connect extends React.Component {
  render () {
    return <Page>
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: this.t('titles.connectToGnosisSafe') }}
      />
      <WalletConnect />
    </Page>
  }
}

export default Connect
