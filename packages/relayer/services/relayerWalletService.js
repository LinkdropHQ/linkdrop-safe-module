import { ethers } from 'ethers'

const { CHAIN, INFURA_API_TOKEN, RELAYER_PRIVATE_KEY } = process.env

class RelayerWalletService {
  constructor () {
    this.chain = CHAIN
    this.jsonRpcUrl =
      INFURA_API_TOKEN && INFURA_API_TOKEN !== ''
        ? `https://${this.chain}.infura.io/v3/${INFURA_API_TOKEN}`
        : `https://${this.chain}.infura.io`
    this.provider = new ethers.providers.JsonRpcProvider(this.jsonRpcUrl)
    this.wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, this.provider)
  }
}

export default new RelayerWalletService()
