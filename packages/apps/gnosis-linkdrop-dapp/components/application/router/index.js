import React from 'react'
import i18next from 'i18next'
import { Loading } from 'components/common'
import { Route, Switch } from 'react-router-dom'
import { Connect, NotFound, Claiming, LinkGenerated, Activate, CreateLink } from 'components/pages'
import './styles'

import { actions } from 'decorators'
@actions(({ user: { loading, locale } }) => ({
  loading,
  locale
}))
class AppRouter extends React.Component {
  componentWillReceiveProps ({ locale }) {
    const { locale: prevLocale } = this.props
    if (locale === prevLocale) { return }
    i18next.changeLanguage(locale)
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
