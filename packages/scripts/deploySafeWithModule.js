import { ethers } from 'ethers'
import CreateAndAddModules from '../contracts/build/CreateAndAddModules'
import ProxyFactory from '../contracts/build/ProxyFactory'
import GnosisSafe from '../contracts/build/GnosisSafe'
import LinkdropModule from '../contracts/build/LinkdropModule'

import * as utils from './utils'

const ADDRESS_ZERO = ethers.constants.AddressZero
const ZERO_BYTES = '0x'
const ZERO = 0

const provider = new ethers.providers.JsonRpcProvider(
  'https://rinkeby.infura.io'
)
const privateKey = ''
const deployer = new ethers.Wallet(privateKey, provider)

const proxyFactoryAddress = '0x12302fE9c02ff50939BaAaaf415fc226C078613C' // from https://safe-relay.rinkeby.gnosis.pm/
const gnosisSafeMasterCopyAddress = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A' // from https://safe-relay.rinkeby.gnosis.pm/
const createAndAddModulesAddress = '0x40Ba7DF971BBdE476517B7d6B908113f71583183'
const linkdropModuleMasterCopyAddress =
  '0x19Ff4Cb4eFD0b9E04433Dde6507ADC68225757f2'

const main = async () => {
  const proxyFactory = new ethers.Contract(
    proxyFactoryAddress,
    ProxyFactory.abi,
    deployer
  )

  const gnosisSafeMasterCopy = new ethers.Contract(
    gnosisSafeMasterCopyAddress,
    GnosisSafe.abi,
    provider
  )

  const createAndAddModules = new ethers.Contract(
    createAndAddModulesAddress,
    CreateAndAddModules.abi,
    provider
  )

  const linkdropModuleMasterCopy = new ethers.Contract(
    linkdropModuleMasterCopyAddress,
    LinkdropModule.abi,
    provider
  )

  const moduleData = utils.getData(linkdropModuleMasterCopy, 'setup', [
    [deployer.address]
  ])
  console.log('moduleData: ', moduleData)

  const proxyFactoryData = utils.getData(proxyFactory, 'createProxy', [
    linkdropModuleMasterCopyAddress,
    moduleData
  ])
  console.log('proxyFactoryData: ', proxyFactoryData)

  const modulesCreationData = utils.createAndAddModulesData([proxyFactoryData])
  console.log('modulesCreationData: ', modulesCreationData)

  const createAndAddModulesData = utils.getData(
    createAndAddModules,
    'createAndAddModules',
    [proxyFactory.address, modulesCreationData]
  )
  console.log('createAndAddModulesData: ', createAndAddModulesData)

  const gnosisSafeData = utils.getData(gnosisSafeMasterCopy, 'setup', [
    [deployer.address], // owners
    1, // treshold
    createAndAddModules.address, // to
    createAndAddModulesData, // data,
    ADDRESS_ZERO, // payment token address
    ZERO, // payment amount
    ADDRESS_ZERO // payment receiver address
  ])
  console.log('gnosisSafeData: ', gnosisSafeData)

  const tx = await proxyFactory.createProxy(
    gnosisSafeMasterCopy.address,
    gnosisSafeData,
    { gasPrice: ethers.utils.parseUnits('20', 'gwei'), gasLimit: 6500000 }
  )
  console.log('txHash: ', tx.hash)

  tx.wait(1)

  const proxy = await utils.getParamFromTxEvent(
    tx, // tx
    'ProxyCreation', // eventName
    'proxy', // paramName
    proxyFactory // contract
  )

  const gnosisSafe = new ethers.Contract(proxy, GnosisSafe.abi, provider)
  console.log('gnosisSafe: ', gnosisSafe.address)

  const modules = await gnosisSafe.getModules()

  const linkdropModule = new ethers.Contract(
    modules[0],
    LinkdropModule.abi,
    deployer
  )
  console.log('linkdropModule: ', linkdropModule.address)
}
main()
