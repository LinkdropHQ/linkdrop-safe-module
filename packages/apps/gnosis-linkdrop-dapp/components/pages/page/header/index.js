import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'

@translate('pages.page')
class Header extends React.Component {
  render () {
    return <div className={styles.container}>
      {this.t('titles.header')}
    </div>
  }
}

export default Header
