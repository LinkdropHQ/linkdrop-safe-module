/* global describe, before, it */

import chai, { expect } from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import { ethers } from 'ethers'

import CreateAndAddModules from '../build/CreateAndAddModules'
import ProxyFactory from '../build/ProxyFactory'
import GnosisSafe from '../build/GnosisSafe'
import LinkdropModule from '../build/LinkdropModule'
import * as utils from './utils'

ethers.errors.setLogLevel('error')
chai.use(solidity)

const ADDRESS_ZERO = ethers.constants.AddressZero
const ZERO_BYTES = '0x'
const ZERO = 0

const provider = createMockProvider()

let [deployer, ownerOne, ownerTwo, linkdropSigner] = getWallets(provider)

describe('Linkdrop Module Tests', () => {
  before(async () => {
    let proxyFactory = await deployContract(deployer, ProxyFactory)

    let createAndAddModules = await deployContract(
      deployer,
      CreateAndAddModules
    )

    let gnosisSafeMasterCopy = await deployContract(deployer, GnosisSafe, [], {
      gasLimit: 6500000
    })

    // Initialize Safe master copy
    await gnosisSafeMasterCopy.setup(
      [ownerOne.address], // owners
      1, // treshold
      ADDRESS_ZERO, // to
      ZERO_BYTES, // data,
      ADDRESS_ZERO, // payment token address
      ZERO, // payment amount
      ADDRESS_ZERO // payment receiver address
    )

    const linkdropModuleMasterCopy = await deployContract(
      deployer,
      LinkdropModule
    )

    const moduleData = utils.getData(linkdropModuleMasterCopy, 'setup', [
      linkdropSigner.address
    ])

    const proxyFactoryData = utils.getData(proxyFactory, 'createProxy', [
      linkdropModuleMasterCopy.address,
      moduleData
    ])

    const modulesCreationData = utils.createAndAddModulesData([
      proxyFactoryData
    ])

    const createAndAddModulesData = utils.getData(
      createAndAddModules,
      'createAndAddModules',
      [proxyFactory.address, modulesCreationData]
    )

    const gnosisSafeData = utils.getData(gnosisSafeMasterCopy, 'setup', [
      [ownerOne.address, ownerTwo.address, deployer.address], // owners
      2, // treshold
      createAndAddModules.address, // to
      createAndAddModulesData, // data,
      ADDRESS_ZERO, // payment token address
      ZERO, // payment amount
      ADDRESS_ZERO // payment receiver address
    ])

    const proxy = await utils.getParamFromTxEvent(
      await proxyFactory.createProxy(
        gnosisSafeMasterCopy.address,
        gnosisSafeData,
        { gasLimit: 6500000 }
      ), // tx
      'ProxyCreation', // eventName
      'proxy', // paramName
      proxyFactory // contract
    )

    const gnosisSafe = new ethers.Contract(proxy, GnosisSafe.abi, provider)

    const modules = await gnosisSafe.getModules()

    const linkdropModule = new ethers.Contract(
      modules[0],
      LinkdropModule.abi,
      provider
    )

    expect(await linkdropModule.manager()).to.equal(gnosisSafe.address)
  })

  it('', async () => {})
})
