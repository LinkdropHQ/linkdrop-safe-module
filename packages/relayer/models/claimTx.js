import mongoose from 'mongoose'

const claimTxSchema = new mongoose.Schema({
  weiAmount: { type: String, required: true },
  tokenAddress: { type: String, required: true },
  tokenAmount: { type: Number, required: true },
  expiration: { type: Number, required: true },
  linkId: { type: String, required: true, unique: true },
  linkdropMasterAddress: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  senderAddress: { type: String, required: true },
  txHash: { type: String, required: true, unique: true }
})

const ClaimTx = mongoose.model('ClaimTx', claimTxSchema)

export default ClaimTx
