import React from 'react'
import { Page } from 'components/pages'
import { translate } from 'decorators'
import styles from './styles.module'
import { Button } from 'components/common'

@translate('pages.activate')
class Activate extends React.Component {
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
      <Button>{this.t('buttons.activate')}</Button>
    </Page>
  }
}

export default Activate
