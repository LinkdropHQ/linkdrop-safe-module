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
    console.log('proxyFactory: ', proxyFactory.address)

    let createAndAddModules = await deployContract(
      deployer,
      CreateAndAddModules
    )

    console.log('createAndAddModules: ', createAndAddModules.address)

    let gnosisSafeMasterCopy = await deployContract(deployer, GnosisSafe, [], {
      gasLimit: 6500000
    })
    console.log('gnosisSafeMasterCopy: ', gnosisSafeMasterCopy.address)

    // Initialize Safe master copy
    await gnosisSafeMasterCopy.setup(
      [ownerOne.address, ownerTwo.address], // owners
      2, // treshold
      ADDRESS_ZERO, // to
      ZERO_BYTES, // data,
      ADDRESS_ZERO, // payment token address
      ZERO, // payment amount
      ADDRESS_ZERO // payment receiver address
    )

    let linkdropModuleMasterCopy = await deployContract(
      deployer,
      LinkdropModule
    )
    console.log('linkdropModuleMasterCopy: ', linkdropModuleMasterCopy.address)

    // Create Gnosis Safe and Whitelist Module in one transactions
    let moduleData = utils.getData(linkdropModuleMasterCopy, 'setup', [
      [linkdropSigner.address]
    ])

    let proxyFactoryData = utils.getData(proxyFactory, 'createProxy', [
      linkdropModuleMasterCopy.address,
      moduleData
    ])

    let modulesCreationData = utils.createAndAddModulesData([proxyFactoryData])

    let createAndAddModulesData = utils.getData(
      createAndAddModules,
      'createAndAddModules',
      [proxyFactory.address, modulesCreationData]
    )

    let gnosisSafeData = utils.getData(gnosisSafeMasterCopy, 'setup', [
      [ownerOne.address, ownerTwo.address], // owners
      2, // treshold
      createAndAddModules.address, // to
      createAndAddModulesData, // data,
      ADDRESS_ZERO, // payment token address
      ZERO, // payment amount
      ADDRESS_ZERO // payment receiver address
    ])

    let gnosisSafe = await proxyFactory.createProxy(
      gnosisSafeMasterCopy.address,
      gnosisSafeData,
      { gasLimit: 6500000 }
    )

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

    console.log({ proxy })

    // let gnosisSafe = utils.getParamFromTxEvent(
    //   tx,
    //   'ProxyCreation',
    //   'proxy',
    //   proxyFactory.address,
    //   GnosisSafe,
    //   'create Gnosis Safe and Whitelist Module'
    // )

    // console.log('gnosisSafe: ', gnosisSafe)
    // let modules = await gnosisSafe.getModules()
    // whitelistModule = WhitelistModule.at(modules[0])
    // assert.equal(await whitelistModule.manager.call(), gnosisSafe.address)
  })

  it('', async () => {})
})
