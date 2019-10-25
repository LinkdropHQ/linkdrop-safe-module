import React from 'react'
import { Page } from 'components/pages'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Button } from 'components/common'

@actions(({ user: { sdk, chainId, loading } }) => ({ sdk, chainId, loading }))
@translate('pages.activate')
class Activate extends React.Component {
  render () {
    const { loading } = this.props
    return <Page>
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: this.t('titles.toContinue') }}
      />
      <div
        className={styles.subtitle}
        dangerouslySetInnerHTML={{ __html: this.t('titles.activate') }}
      />
      <Button loading={loading} onClick={_ => this.actions().user.enableModule()}>{this.t('buttons.activate')}</Button>
    </Page>
  }
}

export default Activate
