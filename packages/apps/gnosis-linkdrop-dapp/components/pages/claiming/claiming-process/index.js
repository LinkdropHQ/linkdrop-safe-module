import React from 'react'
import styles from './styles.module'
import { actions, translate } from 'decorators'
import { Loading } from 'components/common'

@actions(({ claiming: { page } }) => ({
  page
}))
@translate('pages.claiming')
class ClaimingProcess extends React.Component {
  render () {
    return <div className={styles.container}>
      <Loading container className={styles.loading} />
      <div className={styles.title}>{this.t('titles.claiming')}</div>
      <div className={styles.subtitle}>{this.t('titles.transactionInProcess')}</div>
      <div className={styles.note} dangerouslySetInnerHTML={{ __html: this.t('texts.details') }} />
    </div>
  }
}

export default ClaimingProcess
