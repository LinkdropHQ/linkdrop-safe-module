import React from 'react'
import { Page } from 'components/pages'
import { translate } from 'decorators'
import { Input, Button } from 'components/common'
import styles from './styles.module'

@translate('pages.createLink')
class CreateLink extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 0
    }
  }

  render () {
    const { value } = this.state
    return <Page>
      <Input className={styles.input} centered value={value || 0} numberInput suffix='ETH' />
      <Button>{this.t('buttons.createLink')}</Button>
    </Page>
  }
}

export default CreateLink
