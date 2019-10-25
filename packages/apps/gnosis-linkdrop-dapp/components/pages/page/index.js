import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import Header from './header'
import Footer from './footer'

@actions(({
  user: { chainId, safe }
}) => ({
  chainId,
  safe
}))
@translate('pages.page')
class Page extends React.Component {
  componentDidMount () {
    const { chainId, safe } = this.props
    if (!chainId || !safe) {
      window.location.href = '/#/'
    }
  }

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
