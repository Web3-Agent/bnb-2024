import { Request, Response } from "express";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { generateUUId } from "../utils/ids";
import { updateOne } from "../providers/user";

export const getUserNonce = async (request: Request, response: Response) => {
  try {
    const { walletAddress } = request.query;
    if (!walletAddress?.length) {
      return response.status(400).json({
        success: false,
        message: HTTP_RESPONSE_MESSAGES.WALLET_ADDRESS_MISSING,
      });
    }
    const nonce = await generateUUId(12);
    await updateOne({ walletAddress }, { nonce, walletAddress }, { upsert: true, new: true })
    return response.status(200).json({
      success: true,
      message: HTTP_RESPONSE_MESSAGES.NONCE_GENERATED,
      data: { walletAddress, nonce },
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: HTTP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
      error
    });
  }

}
export default { getUserNonce };