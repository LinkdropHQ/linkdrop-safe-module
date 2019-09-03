import mongoose from 'mongoose'

const claimTxERC721Schema = new mongoose.Schema({
  weiAmount: { type: String, required: true },
  nftAddress: { type: String, required: true },
  tokenId: { type: Number, required: true },
  expirationTime: { type: Number, required: true },
  linkId: { type: String, required: true, unique: true },
  linkdropMasterAddress: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  senderAddress: { type: String, required: true },
  txHash: { type: String, required: true, unique: true }
})

const ClaimTxERC721 = mongoose.model('ClaimTxERC721', claimTxERC721Schema)

export default ClaimTxERC721
