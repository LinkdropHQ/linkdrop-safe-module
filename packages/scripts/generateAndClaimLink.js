import SDK from '../sdk'
import { ethers } from 'ethers'

// gnosisSafe:  0xdf75BAc567e46EacA47cAeB2feC627D545201069
// linkdropModule:  0x41753f2e2151baf68b494DED71BFA9233C121ffD

const main = async () => {
  const sdk = new SDK({ apiHost: 'http://localhost:5050' })
  const signingKeyOrWallet = ''

  const provider = new ethers.providers.JsonRpcProvider(
    'https://rinkeby.infura.io'
  )
  const wallet = new ethers.Wallet(signingKeyOrWallet, provider)

  const linkdropModuleAddress = '0x41753f2e2151baf68b494DED71BFA9233C121ffD'
  const receiverAddress = '0x9b5FEeE3B220eEdd3f678efa115d9a4D91D5cf0A'

  const weiAmount = 100
  const tokenAddress = ethers.constants.AddressZero
  const tokenAmount = 0
  const expirationTime = 12345678910

  const link = await sdk.generateLink({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime
  })
  console.log('link: ', link)

  const tx = await sdk.claim({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey: link.linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature: link.linkdropSignerSignature,
    receiverAddress
  })
  console.log('tx: ', tx)
}

main()

// const tx = await wallet.sendTransaction({
//   to: '0x0993fe322C3ECbCbd1801948EF4223DE1f9DDA48',
//   value: ethers.utils.parseEther('0.2'),
//   gasLimit: 600000
// })
// console.log('tx: ', tx)
