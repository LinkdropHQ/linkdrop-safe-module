import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'

@translate('pages.page')
class Header extends React.Component {
  render () {
    const { title } = this.props
    return <div className={styles.container}>
      {title || this.t('titles.header')}
    </div>
  }
}

export default Header
