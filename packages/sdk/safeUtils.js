import { ethers } from 'ethers'
import { executeTx } from './executeTx'
import GnosisSafe from '../contracts/build/contracts/GnosisSafe'
import LinkdropModule from '../contracts/build/LinkdropModule.json'
import ProxyFactory from '../contracts/build/ProxyFactory.json'
import CreateAndAddModules from '../contracts/build/CreateAndAddModules.json'
import { AddressZero } from 'ethers/constants'
import { computeLinkdropModuleAddress } from './computeLinkdropModuleAddress'
const abi = ['function NAME() public view returns (string)']

/**
 * @dev Function to get encoded params data from contract abi
 * @param {Object} abi Contract abi
 * @param {String} method Function name
 * @param {Array<T>} params Array of function params to be encoded
 * @return Encoded params data
 */
export const encodeParams = (abi, method, params) => {
  return new ethers.utils.Interface(abi).functions[method].encode([...params])
}

/**
 * Function to get encoded data to use in CreateAndAddModules library
 * @param {String} dataArray Data array concatenated
 */
export const encodeDataForCreateAndAddModules = dataArray => {
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
 * Function to get whether a given address is Gnosis Safe contract
 * @param {String} jsonRpcUrl JSON RPC URL
 * @param {String} safe Safe address
 */
export const isGnosisSafe = async ({ jsonRpcUrl, safe }) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const gnosisSafe = new ethers.Contract(safe, abi, provider)
  return (await gnosisSafe.NAME()) === 'Gnosis Safe'
}

/**
 * Function to get whether a Safe at given address has linkdrop module enbaled
 * @param {String} jsonRpcUrl JSON RPC URL
 * @param {String} safe Safe address
 */
export const isLinkdropModuleEnabled = async ({ jsonRpcUrl, safe }) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const gnosisSafe = new ethers.Contract(safe, GnosisSafe.abi, provider)
  const modules = await gnosisSafe.getModules()

  for (let i = 0; i < modules.length; i++) {
    const module = new ethers.Contract(modules[i], abi, provider)
    const name = await module.NAME()
    if (name === 'Linkdrop Module') return true
  }
  return false
}

/**
 * Function to enable linkdrop module for existing safe
 * @param {String} safe Existing safe address
 * @param {String} linkdropModuleMasterCopy Linkdrop module master copy address
 * @param {String} createAndAddModules Create and add modules library address
 * @param {String} proxyFactory Proxy factory address
 * @param {String} privateKey Private key of `safe` owner
 * @param {String} apiHost API base url
 * @param {String} jsonRpcUrl JSON RPC URL
 */
export const enableLinkdropModule = async ({
  safe,
  linkdropModuleMasterCopy,
  createAndAddModules,
  proxyFactory,
  privateKey,
  apiHost,
  jsonRpcUrl
}) => {
  const safeOwner = new ethers.Wallet(privateKey)

  const linkdropModuleSetupData = encodeParams(LinkdropModule.abi, 'setup', [
    [safeOwner.address]
  ])

  const linkdropModuleCreationData = encodeParams(
    ProxyFactory.abi,
    'createProxyWithNonce',
    [linkdropModuleMasterCopy, linkdropModuleSetupData, safeOwner.address]
  )

  const modulesCreationData = encodeDataForCreateAndAddModules([
    linkdropModuleCreationData
  ])

  const createAndAddModulesData = encodeParams(
    CreateAndAddModules.abi,
    'createAndAddModules',
    [proxyFactory, modulesCreationData]
  )

  const linkdropModule = computeLinkdropModuleAddress({
    owner: safeOwner.address,
    linkdropModuleMasterCopy,
    deployer: safe
  })

  const { success, txHash, errors } = await executeTx({
    apiHost,
    jsonRpcUrl,
    safe,
    privateKey,
    to: createAndAddModules,
    value: '0',
    data: createAndAddModulesData,
    operation: '1', // delegatecall
    gasToken: AddressZero,
    refundReceiver: AddressZero
  })

  return { success, linkdropModule, txHash, errors }
}
