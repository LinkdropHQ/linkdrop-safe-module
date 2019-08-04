import { ethers } from 'ethers'

const mnemonic =
  'regular dose swallow wear surround hidden turtle unhappy galaxy trend expand life'
console.log('mnemonic: ', mnemonic)

const accountOne = ethers.Wallet.fromMnemonic(mnemonic)
console.log('accountOne: ', accountOne.address, accountOne.privateKey)

const accountTwo = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/1")
console.log('accountTwo: ', accountTwo.address, accountTwo.privateKey)

const accountThree = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/2")
console.log('accountThree: ', accountThree.address, accountThree.privateKey)
