import { createLink, createLinkERC721 } from './utils'
const ethers = require('ethers')

/**
 * @description Function to generate link for ETH and/or ERC20
 * @param {String} claimHost Claim page host
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instances
 * @param {String} weiAmount Wei amount
 * @param {String} tokenAddress Token address
 * @param {Number} tokenAmount Amount of tokens
 * @param {Number} expirationTime Link expiration timestamp
 */
export const generateLink = async ({
  claimHost,
  signingKeyOrWallet,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime
}) => {
  if (claimHost == null || claimHost === '') {
    throw new Error('claimHost param is required')
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error('signingKeyOrWallet param is required')
  }
  if (weiAmount == null || weiAmount === '') {
    throw new Error('weiAmount param is required')
  }
  if (tokenAddress == null || tokenAddress === '') {
    throw new Error('tokenAddress param is required')
  }
  if (tokenAmount == null || tokenAmount === '') {
    throw new Error('tokenAmount param is required')
  }
  if (expirationTime == null || expirationTime === '') {
    throw new Error('expirationTime param is required')
  }

  const { linkKey, linkId, linkdropSignerSignature } = await createLink({
    signingKeyOrWallet,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime
  })

  // Construct url
  const url = `${claimHost}/#/claim?weiAmount=${weiAmount}&tokenAddress=${tokenAddress}&tokenAmount=${tokenAmount}&expirationTime=${expirationTime}&linkKey=${linkKey}&linkdropSignerSignature=${linkdropSignerSignature}`

  return { url, linkId, linkKey, linkdropSignerSignature }
}

/**
 * @description Function to generate link for ETH and/or ERC20
 * @param {String} claimHost Claim page host
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instances
 * @param {String} weiAmount Wei amount
 * @param {String} nftAddress NFT address
 * @param {Number} tokenId Token id
 * @param {Number} expirationTime Link expiration timestamp
 */
export const generateLinkERC721 = async ({
  claimHost,
  signingKeyOrWallet,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime
}) => {
  if (claimHost == null || claimHost === '') {
    throw new Error('claimHost param is required')
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error('signingKeyOrWallet param is required')
  }
  if (weiAmount == null || weiAmount === '') {
    throw new Error('weiAmount param is required')
  }
  if (nftAddress == null || nftAddress === '') {
    throw new Error('nftAddress param is required')
  }
  if (tokenId == null || tokenId === '') {
    throw new Error('tokenId param is required')
  }
  if (expirationTime == null || expirationTime === '') {
    throw new Error('expirationTime param is required')
  }

  const { linkKey, linkId, linkdropSignerSignature } = await createLink({
    signingKeyOrWallet,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime
  })

  // Construct url
  const url = `${claimHost}/#/claim?weiAmount=${weiAmount}&nftAddress=${nftAddress}&tokenId=${tokenId}&expirationTime=${expirationTime}&linkKey=${linkKey}&linkdropSignerSignature=${linkdropSignerSignature}`

  return { url, linkId, linkKey, linkdropSignerSignature }
}
