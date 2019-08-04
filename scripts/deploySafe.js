import GnosisSafe from '../build/GnosisSafe'
import ProxyFactory from '../build/ProxyFactory'
import { getData, getParamFromTxEvent } from './utils'

const ethers = require('ethers')

const mnemonic =
  'regular dose swallow wear surround hidden turtle unhappy galaxy trend expand life'

console.log('mnemonic: ', mnemonic)

const provider = new ethers.providers.JsonRpcProvider(
  'https://rinkeby.infura.io'
)

const wallet = new ethers.Wallet(
  '0xf211587a094b375ec378f61b4bc36e667733048237ee2a35c498efcaba24bd20', // privKey corresponds to first account of ^ mnemonic
  provider
)

const address = wallet.signingKey.address
console.log('wallet: ', address)

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

const main = async () => {
  const gnosisSafeMasterCopy = new ethers.Contract(
    '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A', // from https://safe-relay.gnosis.pm/api/v1/about/,
    GnosisSafe.abi,
    wallet
  )

  const gnosisSafeData = getData(gnosisSafeMasterCopy, 'setup', [
    [
      '0x83793703bA5D7f0c09970eBD00568B5A2b961d41',
      '0xc23a3961c173D46eeaf17876c547aE8ecda96d16',
      '0xdE466f343c58a519dBD43D547693532Ae0cfFAeE'
    ], // owners
    1, // treshold
    ADDRESS_ZERO, // to
    BYTES_ZERO, // data,
    ADDRESS_ZERO, // payment token address
    0, // payment amount
    ADDRESS_ZERO // payment receiver address
  ])

  console.log('gnosisSafeData: ', gnosisSafeData)

  const proxyFactory = new ethers.Contract(
    '0x12302fE9c02ff50939BaAaaf415fc226C078613C', // from https://safe-relay.gnosis.pm/api/v1/about/,
    ProxyFactory.abi,
    wallet
  )

  const creationNonce = new Date().getTime()
  const tx = await proxyFactory.createProxyWithNonce(
    gnosisSafeMasterCopy.address,
    gnosisSafeData,
    creationNonce,
    { gasLimit: 6500000 }
  )

  console.log('Tx hash:', tx.hash)
  tx.wait(1)

  const safeProxyAddress = await getParamFromTxEvent(
    tx, // tx
    'ProxyCreation', // eventName
    'proxy', // paramName
    proxyFactory // contract
  )

  console.log('safeProxyAddress: ', safeProxyAddress)
}
main()
