import ClaimTx from '../models/claimTx'
import ClaimTxERC721 from '../models/claimTxERC721'
import LinkdropModule from '../../contracts/build/LinkdropModule.json'
import logger from '../utils/logger'
import relayerWalletService from '../services/relayerWalletService'

const ethers = require('ethers')
ethers.errors.setLogLevel('error')

export const claim = async (req, res) => {
  //
  const {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  } = req.body

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
  if (linkId == null || linkId === '') {
    throw new Error('linkId param is required')
  }
  if (linkdropModuleAddress == null || linkdropModuleAddress === '') {
    throw new Error('linkdropModuleAddress param is required')
  }
  if (linkdropSignerSignature == null || linkdropSignerSignature === '') {
    throw new Error('linkdropSignerSignature param is required')
  }
  if (receiverAddress == null || receiverAddress === '') {
    throw new Error('receiverAddress param is required')
  }
  if (receiverSignature == null || receiverSignature === '') {
    throw new Error('receiverSignature param is required')
  }

  const linkdropModule = new ethers.Contract(
    linkdropModuleAddress,
    LinkdropModule.abi,
    relayerWalletService.wallet
  )

  // Check whether a claim tx exists in database
  const oldClaimTx = await ClaimTx.findOne({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    receiverAddress
  })

  if (oldClaimTx && oldClaimTx.txHash) {
    logger.info('Submitted claim transaction')
    logger.info(`txHash: ${oldClaimTx.txHash}`)

    return res.json({
      success: true,
      txHash: oldClaimTx.txHash
    })
  }

  try {
    let tx, txHash

    logger.debug('Checking link params:')
    logger.json({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    })

    // Check link params
    await linkdropModule.checkLinkParams(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    )
    logger.debug('Link params check passed succesfully...')

    logger.debug('Claiming...')
    // Claim
    tx = await linkdropModule.claimLink(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000 }
    )

    txHash = tx.hash

    // Save claim tx to database
    const claimTx = new ClaimTx({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropModuleAddress,
      receiverAddress,
      txHash
    })

    const document = await claimTx.save()

    logger.info('Submitted claim transaction')
    logger.info(`txHash: ${txHash}`)

    res.json({
      success: true,
      txHash: txHash
    })
  } catch (error) {
    logger.error(`${error.reason ? error.reason : error}`)

    return res.json({
      success: false,
      error: error
    })
  }
}

export const claimERC721 = async (req, res) => {
  //
  const {
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  } = req.body

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
  if (linkId == null || linkId === '') {
    throw new Error('linkId param is required')
  }
  if (linkdropModuleAddress == null || linkdropModuleAddress === '') {
    throw new Error('linkdropModuleAddress param is required')
  }
  if (linkdropSignerSignature == null || linkdropSignerSignature === '') {
    throw new Error('linkdropSignerSignature param is required')
  }
  if (receiverAddress == null || receiverAddress === '') {
    throw new Error('receiverAddress param is required')
  }
  if (receiverSignature == null || receiverSignature === '') {
    throw new Error('receiverSignature param is required')
  }

  const linkdropModule = new ethers.Contract(
    linkdropModuleAddress,
    LinkdropModule.abi,
    relayerWalletService.wallet
  )

  // Check whether a claim tx exists in database
  const oldClaimTx = await ClaimTx.findOne({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    receiverAddress
  })

  if (oldClaimTx && oldClaimTx.txHash) {
    logger.info('Submitted claim transaction')
    logger.info(`txHash: ${oldClaimTx.txHash}`)

    return res.json({
      success: true,
      txHash: oldClaimTx.txHash
    })
  }

  try {
    let tx, txHash

    logger.debug('Checking link params:')
    logger.json({
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    })

    // Check link params
    await linkdropModule.checkLinkParams(
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    )
    logger.debug('Link params check passed succesfully...')

    logger.debug('Claiming...')
    // Claim
    tx = await linkdropModule.claimLink(
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000 }
    )

    txHash = tx.hash

    // Save claim tx to database
    const claimTx = new ClaimTx({
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropModuleAddress,
      receiverAddress,
      txHash
    })

    const document = await claimTx.save()

    logger.info('Submitted claim transaction')
    logger.info(`txHash: ${txHash}`)

    res.json({
      success: true,
      txHash: txHash
    })
  } catch (error) {
    logger.error(`${error.reason ? error.reason : error}`)

    return res.json({
      success: false,
      error: error
    })
  }
}
