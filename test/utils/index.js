import { ethers } from 'ethers'

const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'

export const createAndAddModulesData = dataArray => {
  const moduleDataWrapper = new ethers.utils.Interface([
    'function setup(bytes data)'
  ])

  // Remove method id (10) and position of data in payload (64)
  return dataArray.reduce(
    (acc, data) =>
      acc + moduleDataWrapper.functions.setup.encode([data]).substr(74),
    '0x'
  )
}

/**
 * @dev Function to get data from functions
 * @param contract - contract instance compatible with ethers.js
 * @param method - string of function name
 * @param params - array of function parameters
 */
export const getData = (contract, method, params) => {
  return contract.interface.functions[method].encode([...params])
}

export const getParamFromTxEvent = async (
  tx,
  eventName,
  paramName,
  contract
) => {
  const provider = contract.provider
  const txReceipt = await provider.getTransactionReceipt(tx.hash)
  const topic = contract.interface.events[eventName].topic
  let logs = txReceipt.logs
  logs = logs.filter(
    l => l.address === contract.address && l.topics[0] === topic
  )
  const param = contract.interface.events[eventName].decode(logs[0].data)[
    paramName
  ]
  return param
}
