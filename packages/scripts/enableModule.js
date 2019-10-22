import { ethers } from 'ethers'
import CreateAndAddModules from '../contracts/build/CreateAndAddModules'
import ProxyFactory from '../contracts/build/ProxyFactory'
import GnosisSafe from '../contracts/build/GnosisSafe'
import LinkdropModule from '../contracts/build/LinkdropModule.json'

import * as utils from './utils'
import { enableLinkdropModule } from '../sdk/safeUtils'

const ADDRESS_ZERO = ethers.constants.AddressZero
const ZERO_BYTES = '0x'
const ZERO = 0

const jsonRpcUrl = 'https://rinkeby.infura.io'
const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
const privateKey = ''
const deployer = new ethers.Wallet(privateKey, provider)

const proxyFactoryAddress = '0x12302fE9c02ff50939BaAaaf415fc226C078613C' // from https://safe-relay.rinkeby.gnosis.pm/
const gnosisSafeMasterCopyAddress = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A' // from https://safe-relay.rinkeby.gnosis.pm/
const createAndAddModulesAddress = '0x40Ba7DF971BBdE476517B7d6B908113f71583183'
const linkdropModuleMasterCopy = '0xB74bBDb7830b7845b73184958Cd00B341C6644C9'

const main = async () => {
  const proxyFactory = new ethers.Contract(
    proxyFactoryAddress,
    ProxyFactory.abi,
    deployer
  )

  const safe = '0x6A2F2516b53e7B0E92378712B24dA39a4542B003'

  console.log({
    safe,
    linkdropModuleMasterCopy,
    proxyFactory: proxyFactory.address,
    createAndAddModules: createAndAddModulesAddress,
    privateKey,
    gasPrice: '0',
    apiHost: 'http://localhost:5050',
    jsonRpcUrl
  })

  const {
    success,
    linkdropModule,
    txHash,
    errors
  } = await enableLinkdropModule({
    safe,
    linkdropModuleMasterCopy,
    proxyFactory: proxyFactory.address,
    createAndAddModules: createAndAddModulesAddress,
    privateKey,
    gasPrice: '0',
    apiHost: 'http://localhost:5050',
    jsonRpcUrl
  })

  console.log({
    success,
    linkdropModule,
    txHash,
    errors
  })
}
main()
