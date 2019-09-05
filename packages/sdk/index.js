import { generateLink, generateLinkERC721 } from './generateLink'
import { claim, claimERC721 } from './claim'
import { ethers } from 'ethers'

class SDK {
  constructor ({
    chain = 'rinkeby',
    apiHost = 'https://safe.linkdrop.io',
    claimHost = 'https://claim.linkdrop.io'
  }) {
    if (chain !== 'rinkeby' && chain !== 'mainnet') {
      throw new Error('Unsupported chain')
    }
    this.chain = chain
    this.jsonRpcUrl = `${chain}.infura.io`
    this.apiHost = apiHost
    this.claimHost = claimHost
  }

  async generateLink ({
    signingKeyOrWallet,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime
  }) {
    return generateLink({
      claimHost: this.claimHost,
      signingKeyOrWallet,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime
    })
  }

  async generateLinkERC721 ({
    signingKeyOrWallet,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime
  }) {
    return generateLinkERC721({
      claimHost: this.claimHost,
      signingKeyOrWallet,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime
    })
  }

  async claim ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    senderAddress,
    linkdropSignerSignature,
    receiverAddress
  }) {
    return claim({
      apiHost: this.apiHost,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      senderAddress,
      linkdropSignerSignature,
      receiverAddress
    })
  }

  async claimERC721 ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkKey,
    senderAddress,
    linkdropSignerSignature,
    receiverAddress
  }) {
    return claim({
      apiHost: this.apiHost,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkKey,
      senderAddress,
      linkdropSignerSignature,
      receiverAddress
    })
  }
}

export default SDK
