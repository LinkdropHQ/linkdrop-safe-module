import axios from 'axios'
import assert from 'assert-js'
import { ethers } from 'ethers'
import { signTx } from './signTx'
import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import { estimateGasCosts } from './estimateTxGas'
import Web3 from 'web3'
import { provider } from 'ganache-core'

/**
 * Function to execute safe transaction
 * @param {String} apiHost API host
 * @param {String} jsonRpcUrl JSON RPC URL
 * @param {String} safe Safe address
 * @param {String} privateKey Safe owner's private key
 * @param {String} to To
 * @param {String} value Value
 * @param {String} data Data
 * @param {String} operation Operation
 * @param {String} gasToken Gas token
 * @param {String} refundReceiver Refund receiver
 * @returns {Object} {success, txHash, errors}
 */
export const executeTx = async ({
  apiHost,
  jsonRpcUrl,
  safe,
  privateKey,
  to,
  value,
  data,
  operation,
  gasToken,
  gasPrice = '0',
  refundReceiver
}) => {
  assert.url(apiHost, 'Api host is required')
  assert.url(jsonRpcUrl, 'Json rpc url is required')
  assert.string(safe, 'Safe address is required')
  assert.string(privateKey, 'Private key is required')
  assert.string(to, 'To is required')
  assert.string(value, 'Value is required')
  assert.string(data, 'Data is required')
  assert.string(gasToken, 'Gas token is required')
  assert.string(refundReceiver, 'Refund receiver address is required')
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const gnosisSafe = new ethers.Contract(safe, GnosisSafe.abi, provider)
  const nonce = await gnosisSafe.nonce()

  const safeTxGas = '0'
  const baseGas = '0'

  const signature = await signTx({
    safe,
    privateKey,
    to,
    value,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce: nonce.toString()
  })

  const response = await axios.post(`${apiHost}/transactions/execute`, {
    safe,
    to,
    value,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    signature
  })

  const { success, txHash, errors } = response.data

  return {
    success,
    txHash,
    errors
  }
}
