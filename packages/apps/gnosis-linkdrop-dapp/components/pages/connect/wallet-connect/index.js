import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import styles from './styles.module'
import WalletConnect from '@walletconnect/browser'
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal'

@actions(({ user }) => ({ user }))
@translate('pages.connect')
class WalletConnectComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: undefined
    }
    this.walletConnector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org' // Required
    })

    if (!this.walletConnector.connected) {
      this.walletConnector.createSession().then(() => {
        this.state({
          uri: this.walletConnector.uri
        })
      })
    }

    if (this.walletConnector.connected) {
      const { _chainId: chainId, accounts } = this.walletConnector
      this.actions().user.setWalletConnectData({ chainId, accounts })
    }

    this.walletConnector.on('connect', (error, payload) => {
      if (error) {
        throw error
      }

      // Close QR Code Modal
      WalletConnectQRCodeModal.close()

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0]
      this.actions().user.setWalletConnectData({ chainId, accounts })
    })

    this.walletConnector.on('session_update', (error, payload) => {
      console.log('session changed')
      if (error) {
        throw error
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0]
      this.actions().user.setWalletConnectData({ chainId, accounts })
    })

    this.walletConnector.on('disconnect', (error, payload) => {
      console.log('disconnected')
      if (error) {
        throw error
      }

      this.actions().user.setWalletConnectData({ chainId: null, accounts: null })
    })
  }

  showModalWindow () {
    const { uri } = this.state
    WalletConnectQRCodeModal.open(uri, () => {
      console.log('QR Code Modal closed')
    })
  }

  render () {
    const { uri } = this.props
    return <Button
      disabled={!uri}
      loading={!uri}
      className={styles.button}
      onClick={_ => this.showModalWindow()}
    >
      {this.t('buttons.connect')}
    </Button>
  }
}

export default WalletConnectComponent
