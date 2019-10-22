import LinkdropModule from '../../contracts/build/LinkdropModule.json'
import logger from '../utils/logger'
import transactionRelayService from '../services/transactionRelayService'
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

export const executeTx = async (req, res) => {
  try {
    const {
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
    } = req.body

    const { success, txHash, errors } = await transactionRelayService.executeTx(
      {
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
      }
    )
    logger.json({ success, txHash, errors })

    res.json({
      success,
      txHash,
      errors
    })
  } catch (err) {
    logger.error(err)

    return res.json({
      success: false,
      error: err
    })
  }
}
