import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'

@translate('pages.page')
class Footer extends React.Component {
  render () {
    return <div className={styles.container} dangerouslySetInnerHTML={{ __html: this.t('titles.footer') }} />
  }
}

export default Footer
