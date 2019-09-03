import ClaimTx from '../models/claimTx'
import ClaimTxERC721 from '../models/claimTxERC721'
import LinkdropModule from '../../contracts/build/LinkdropModule.json'
import logger from '../utils/logger'

const ethers = require('ethers')
ethers.errors.setLogLevel('error')

const JSON_RPC_URL = process.env.JSON_RPC_URL
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY

if (JSON_RPC_URL == null || JSON_RPC_URL === '') {
  throw new Error('Please provide json rpc url')
}

if (RELAYER_PRIVATE_KEY == null || RELAYER_PRIVATE_KEY === '') {
  throw new Error('Please provide relayer private key')
}

const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)
const relayer = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider)

export const claim = async (req, res) => {
  //
  const {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  } = req.body

  const linkdropModule = new ethers.Contract(
    senderAddress,
    LinkdropModule.abi,
    relayer
  )

  // Check whether a claim tx exists in database
  const oldClaimTx = await ClaimTx.findOne({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    senderAddress,
    receiverAddress
  })

  if (oldClaimTx && oldClaimTx.txHash) {
    logger.info('Submitted claim transaction')
    logger.info('txHash:', oldClaimTx.txHash)

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
      senderAddress,
      senderSignature,
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
      senderAddress,
      receiverAddress,
      txHash
    })

    const document = await claimTx.save()

    logger.info('Submitted claim transaction')
    logger.info('txHash:', txHash)

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
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  } = req.body

  const linkdropModule = new ethers.Contract(
    senderAddress,
    LinkdropModule.abi,
    relayer
  )

  // Check whether a claim tx exists in database
  const oldClaimTx = await ClaimTx.findOne({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    senderAddress,
    receiverAddress
  })

  if (oldClaimTx && oldClaimTx.txHash) {
    logger.info('Submitted claim transaction')
    logger.info('txHash:', oldClaimTx.txHash)

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
      senderAddress,
      senderSignature,
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
      senderAddress,
      receiverAddress,
      txHash
    })

    const document = await claimTx.save()

    logger.info('Submitted claim transaction')
    logger.info('txHash:', txHash)

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
