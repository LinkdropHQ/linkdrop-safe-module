import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import Header from './header'
import Footer from './footer'

@actions(({
  user: { chainId }
}) => ({
  chainId
}))
@translate('pages.page')
class Page extends React.Component {
  render () {
    const { children, title } = this.props
    return <div className={styles.container}>
      <Header title={title} />
      <div
        className={styles.main}
        style={{ height: 'calc(100vh - 130px)' }}
      >
        {children}
      </div>
      <Footer />
    </div>
  }
}

export default Page
