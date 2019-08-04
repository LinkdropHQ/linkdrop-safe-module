import GnosisSafe from '../build/GnosisSafe'
import PayingProxy from '../build/PayingProxy'

const ethers = require('ethers')

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
  await wallet.connect(provider)

  const masterCopyAddress = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A' // from https://safe-relay.gnosis.pm/api/v1/about/

  const gnosisSafeMasterCopy = new ethers.Contract(
    masterCopyAddress,
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

  const factory = new ethers.ContractFactory(
    PayingProxy.abi,
    PayingProxy.bytecode,
    wallet
  )

  const payingProxy = await factory.deploy(
    masterCopyAddress,
    gnosisSafeData,
    ADDRESS_ZERO,
    ADDRESS_ZERO,
    0,
    {
      gasLimit: 6700000,
      gasPrice: ethers.utils.parseUnits('10', 'gwei')
    }
  )

  const payingProxyAddr = payingProxy.address
  console.log('payingProxyAddr: ', payingProxyAddr)

  const safe = new ethers.Contract(payingProxyAddr, GnosisSafe.abi, provider)
}
main()
