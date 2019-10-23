import React from 'react'
import i18next from 'i18next'
import { Route, Switch } from 'react-router-dom'
import { Connect, NotFound, Claiming, LinkGenerated, Activate, CreateLink } from 'components/pages'
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
      <Route path='/activate' component={Activate} />
      <Route path='/create-link' component={CreateLink} />
      <Route path='/link-generated' component={LinkGenerated} />
      <Route path='/receive' component={Claiming} />
      <Route path='/' component={Connect} />
      <Route path='*' component={NotFound} />
    </Switch>
  }
}

export default AppRouter
