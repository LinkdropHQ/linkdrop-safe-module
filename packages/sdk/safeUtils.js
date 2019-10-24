import { ethers } from 'ethers'
import { executeTx } from './executeTx'
import GnosisSafe from '../contracts/build/GnosisSafe'
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
 * Function to get data to enable linkdrop module for existing safe
 * @param {String} safe Existing safe address
 * @param {String} linkdropModuleMasterCopy Linkdrop module master copy address
 * @param {String} createAndAddModules Create and add modules library address
 * @param {String} proxyFactory Proxy factory address
 * @param {String} jsonRpcUrl JSON RPC URL
 */
export const getEnableLinkdropModuleData = async ({
  safe,
  linkdropModuleMasterCopy,
  createAndAddModules,
  proxyFactory,
  jsonRpcUrl
}) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  const safeWallet = new ethers.Contract(safe, GnosisSafe.abi, provider)

  const owners = await safeWallet.getOwners()

  const linkdropModuleSetupData = encodeParams(LinkdropModule.abi, 'setup', [
    owners
  ])

  const linkdropModuleCreationData = encodeParams(
    ProxyFactory.abi,
    'createProxyWithNonce',
    [linkdropModuleMasterCopy, linkdropModuleSetupData, owners[0]]
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
    owners,
    linkdropModuleMasterCopy,
    deployer: safe
  })

  return {
    data: createAndAddModulesData,
    address: linkdropModule
  }
}
