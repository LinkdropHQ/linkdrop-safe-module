import { ethers } from 'ethers'

const abi = ['function NAME() public view returns (string)']

/**
 * Function to get whether a given address is Gnosis Safe contract
 * @param {String} jsonRpcUrl JSON RPC URL
 * @param {String} safe Safe address
 */
export const isGnosiSafe = async ({ jsonRpcUrl, safe }) => {
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
