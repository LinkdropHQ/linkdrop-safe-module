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
 * Function to get specific param from transaction event
 * @param {Object} tx Transaction object compatible with ethers.js library
 * @param {String} eventName Event name to parse param from
 * @param {String} paramName Parameter to be retrieved from event log
 * @param {Object} contract Contract instance compatible with ethers.js library
 * @return {String} Parameter parsed from transaction event
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

/**
 *
 * @param {Object} linkdropSigner Ethers.js wallet
 * @param {Number} weiAmount Amount of wei
 * @param {String} tokenAddress Address of token contract
 * @param {Number} tokenAmount Amount of tokens
 * @param {Number} expiration Link expiration timestamp
 * @param {String} linkId Link id
 * @return {String} signature
 */
const signLink = async function (
  linkdropSigner, // Wallet
  weiAmount,
  tokenAddress,
  tokenAmount,
  expiration,
  linkId
) {
  let messageHash = ethers.utils.solidityKeccak256(
    ['uint', 'address', 'uint', 'uint', 'address'],
    [weiAmount, tokenAddress, tokenAmount, expiration, linkId]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await linkdropSigner.signMessage(messageHashToSign)
  return signature
}

/**
 *
 * @param {Object} linkdropSigner Ethers.js wallet
 * @param {Number} weiAmount
 * @param {String} tokenAddress
 * @param {Number} tokenAmount
 * @param {Number} expiration
 * @return {Object} `{linkKey, linkId, linkdropSignerSignature}`
 */
export const createLink = async function (
  linkdropSigner, // Wallet
  weiAmount,
  tokenAddress,
  tokenAmount,
  expiration
) {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address

  let linkdropSignerSignature = await signLink(
    linkdropSigner,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expiration,
    linkId
  )

  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop verifier
  }
}

/**
 * Function to sign receiver address
 * @param {String} linkKey Link's ephemeral private key
 * @param {String} receiverAddress Address of receiver
 * @return {String} signature
 */
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
