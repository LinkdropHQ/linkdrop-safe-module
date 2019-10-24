import React from 'react'
import { Page } from 'components/pages'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Button } from 'components/common'

@actions(({ user: { sdk, chainId } }) => ({ sdk, chainId }))
@translate('pages.activate')
class Activate extends React.Component {
  componentDidMount () {
    const { sdk, chainId } = this.props
    if (!chainId) {
      window.location.href = '/#/'
      return
    }
    if (!sdk) {
      this.actions().user.initializeSdk()
    }
  }

  render () {
    return <Page>
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: this.t('titles.toContinue') }}
      />
      <div
        className={styles.subtitle}
        dangerouslySetInnerHTML={{ __html: this.t('titles.activate') }}
      />
      <Button onClick={_ => this.actions().user.enableModule()}>{this.t('buttons.activate')}</Button>
    </Page>
  }
}

export default Activate
