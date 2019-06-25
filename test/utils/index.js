import { ethers } from 'ethers'

export const createAndAddModulesData = dataArray => {
  const moduleDataWrapper = new ethers.utils.Interface([
    'function setup(bytes data)'
  ])

  // Remove method id (10) and position of data in payload (64)
  return dataArray.reduce(
    (acc, data) =>
      acc + moduleDataWrapper.functions.setup.encode([data]).substr(74),
    '0x'
  )
}

/**
 * @dev Function to get encoded params data
 * @param {Object} contract Contract instance compatible with ethers.js library
 * @param {String} method Function name
 * @param {Array<T>} params Array of function params to be encoded
 * @return Encoded params data
 */
export const getData = (contract, method, params) => {
  return contract.interface.functions[method].encode([...params])
}

/**
 * @dev Function to get specific param from transaction event
 * @param tx Transaction object compatible with ethers.js library
 * @param eventName Event name to parse param from
 * @param paramName Parameter to be retrieved from event log
 * @param contract Contract instance compatible with ethers.js library
 * @return Parameter parsed from transaction event
 */
export const getParamFromTxEvent = async (
  tx,
  eventName,
  paramName,
  contract
) => {
  const provider = contract.provider
  const txReceipt = await provider.getTransactionReceipt(tx.hash)
  const topic = contract.interface.events[eventName].topic
  let logs = txReceipt.logs
  logs = logs.filter(
    l => l.address === contract.address && l.topics[0] === topic
  )
  const param = contract.interface.events[eventName].decode(logs[0].data)[
    paramName
  ]
  return param
}

const signLink = async function (
  linkdropSigner, // Wallet
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  linkId
) {
  let messageHash = ethers.utils.solidityKeccak256(
    ['uint', 'address', 'uint', 'uint', 'address'],
    [weiAmount, tokenAddress, tokenAmount, expirationTime, linkId]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await linkdropSigner.signMessage(messageHashToSign)
  return signature
}

// Generates new link
export const createLink = async function (
  linkdropSigner, // Wallet
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime
) {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address

  let linkdropSignerSignature = await signLink(
    linkdropSigner,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId
  )

  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop verifier
  }
}

export const signReceiverAddress = async function (linkKey, receiverAddress) {
  let wallet = new ethers.Wallet(linkKey)
  let messageHash = ethers.utils.solidityKeccak256(
    ['address'],
    [receiverAddress]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await wallet.signMessage(messageHashToSign)
  return signature
}
