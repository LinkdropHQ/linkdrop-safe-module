import React from 'react'
import Web3Connect from 'web3connect'
import WalletConnectProvider from '@walletconnect/web3-provider'

const WalletConnect = () => <div>
  <Web3Connect.Button
    network='mainnet' // optional
    providerOptions={{
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: 'ecd43c9cd96e45ceb9131fba9b100b07'
        }
      }
    }}
    onConnect={provider => {
      const web3 = new Web3(provider)
    }}
    onClose={() => {
      console.log('Web3Connect Modal Closed')
    }}
  />
</div>

export default WalletConnect
