import React from 'react'
import { Page } from 'components/pages'
import ClaimingFinished from './claiming-finished'
import ClaimingProcess from './claiming-process'
import SetAddress from './set-address'
import InitialPage from './initial-page'
import ChooseWallet from './choose-wallet-page'
import { Loading } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { actions, translate } from 'decorators'

@actions(({ claiming: { page } }) => ({
  page
}))
@translate('pages.claiming')
class Claiming extends React.Component {
  render () {
    const { page } = this.props
    return <Page title={this.t('titles.getTokens')}>
      <div className={styles.container}>
        {this.renderPage({ page })}
      </div>
    </Page>
  }

  renderPage ({ page }) {
    switch (page) {
      case 'initial-page':
        return <InitialPage />
      case 'set-address':
        return <SetAddress />
      case 'choose-wallet':
        return <ChooseWallet />
      case 'claiming-process':
        return <ClaimingProcess />
      case 'claiming-finished':
        return <ClaimingFinished />
      default:
        return <Loading />
    }
  }
}

export default Claiming
