import SDK from '../sdk'
import { ethers } from 'ethers'

// gnosisSafe:  0xDC32b6C2117c337ECE17A0943337513c7E2A770d
// linkdropModule:  0xd2909562be80684A443bcCB84DAF7AA5e50E1a0B

const main = async () => {
  const sdk = new SDK({ apiHost: 'http://localhost:5050' })
  const signingKeyOrWallet =
    'EEDFA6C63D0B44CE6C511C7A9425A8668DFADFC8F47FF24647A92489D5A913CC'

  const provider = new ethers.providers.JsonRpcProvider(
    'https://rinkeby.infura.io'
  )
  const wallet = new ethers.Wallet(signingKeyOrWallet, provider)

  const linkdropModuleAddress = '0xd2909562be80684A443bcCB84DAF7AA5e50E1a0B'
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
