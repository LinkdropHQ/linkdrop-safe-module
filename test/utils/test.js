'use strict'

var fs = require('fs')
var ethers = require('ethers')

var path = './tests/make-tests/test-wallets/wallet-secretstorage-foo.json'

var contractAbi = [
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'age',
        type: 'string'
      }
    ],
    name: 'updateProfile',
    outputs: [],
    payable: false,
    type: 'function'
  }
]

var contractAddress = '0x0123456789012345678901234567890123456789'
var iface = new ethers.utils.Interface(contractAbi)

function main () {
  const wallet = ethers.Wallet.createRandom()

  // This object contains several useful things for handling contract functions,
  // but for your purposes, you really only care about the data
  var func = iface.functions.updateProfile('RicMoo', '36')

  var tx = {
    gasPrice: 2000000000,
    gasLimit: 185000,
    data: func.data,
    to: contractAddress,
    nonce: 0
  }

  var signedTransaction = wallet.sign(tx)
  console.log(signedTransaction)
}

main()
