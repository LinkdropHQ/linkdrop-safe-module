import React from 'react'
import i18next from 'i18next'
import { Route, Switch } from 'react-router-dom'
import { Main, NotFound } from 'components/pages'
import './styles'

import { actions } from 'decorators'
@actions(({ user: { sdk, loading, locale } }) => ({
  sdk,
  loading,
  locale
}))
class AppRouter extends React.Component {
  componentWillReceiveProps ({ locale }) {
    const { locale: prevLocale } = this.props
    if (locale === prevLocale) { return }
    i18next.changeLanguage(locale)
  }

  componentDidMount () {
    // const { sdk } = this.props
    // if (!sdk) {
    //   const {
    //     linkdropMasterAddress
    //   } = getHashVariables()
    //   this.actions().user.createSdk({ linkdropMasterAddress })
    // }
  }

  render () {
    return <Switch>
      <Route path='/' component={Main} />
      <Route path='*' component={NotFound} />
    </Switch>
  }
}

export default AppRouter
