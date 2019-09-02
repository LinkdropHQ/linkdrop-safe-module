import ProxyFactory from '../build/ProxyFactory'
import GnosisSafe from '../build/GnosisSafe'

const ethers = require('ethers')

const provider = new ethers.providers.JsonRpcProvider(
  'https://rinkeby.infura.io'
)

const wallet = new ethers.Wallet(
  '0xf211587a094b375ec378f61b4bc36e667733048237ee2a35c498efcaba24bd20', // privKey corresponds to first account of ^ mnemonic
  provider
)

const gnosisSafeMasterCopy = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A'

const creationNonce = 1564963422695

const main = async () => {
  const gnosisSafeData =
    '0xa97ab18a00000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ab6a2c69de9f40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000083793703ba5d7f0c09970ebd00568b5a2b961d41000000000000000000000000c23a3961c173d46eeaf17876c547ae8ecda96d16000000000000000000000000de466f343c58a519dbd43d547693532ae0cffaee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
  const proxyFactory = new ethers.Contract(
    '0x12302fE9c02ff50939BaAaaf415fc226C078613C', // from https://safe-relay.gnosis.pm/api/v1/about/,
    ProxyFactory.abi,
    wallet
  )

  const proxyCreationCode = await proxyFactory.proxyCreationCode()
  console.log('proxyCreationCode: ', proxyCreationCode)

  const constructorData = ethers.utils.defaultAbiCoder.encode(
    ['address'],
    [gnosisSafeMasterCopy]
  )

  console.log('constructorData2: ', constructorData)

  const encodedNonce = ethers.utils.defaultAbiCoder.encode(
    ['uint256'],
    [creationNonce]
  )

  console.log('encodedNonce2: ', encodedNonce)
  console.log('Proxy factory', proxyFactory.address)
  const salt = ethers.utils.keccak256(
    ethers.utils.keccak256(gnosisSafeData) + encodedNonce.slice(2)
  )
  console.log('salt: ', salt)
  const initcode = proxyCreationCode + constructorData.slice(2)
  console.log('initcode: ', initcode)

  const target2 = buildCreate2Address(proxyFactory.address, salt, initcode)

  console.log('target2: ', target2)
}

const getGnosisSafeData = (owners, threshold) => {
  const data = new ethers.utils.Interface(GnosisSafe.abi).functions[
    'setup'
  ].encode([
    owners, // owners
    threshold, // treshold
    ethers.constants.AddressZero, // to
    '0x', // data,
    ethers.constants.AddressZero, // payment token address
    0, // payment amount
    ethers.constants.AddressZero // payment receiver address
  ])
  console.log({ data })
  return data
}

export const buildCreate2Address = (creatorAddress, saltHex, byteCode) => {
  const byteCodeHash = ethers.utils.keccak256(byteCode)
  return `0x${ethers.utils
    .keccak256(
      `0x${['ff', creatorAddress, saltHex, byteCodeHash]
        .map(x => x.replace(/0x/, ''))
        .join('')}`
    )
    .slice(-40)}`.toLowerCase()
}

main()
