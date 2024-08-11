import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { ethers } from "ethers";
import { fetchOne } from "../providers/user";

import { ENV_VARIABLES } from "../configurations/env";

import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { CustomRequest } from "../types/customRequest";

export const validateAccess = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    let { walletaddress, signature } = request.headers;
    const walletAddress = walletaddress?.toString()?.toLowerCase();
    const query = { walletAddress: { '$regex': walletAddress, $options: 'i' } };
    const user = await fetchOne(query);

    if (!user) {
      throw new Error('USER_NOT_EXISTS')
    }
    const { nonce, } = user;
    const decodedAddress = ethers.verifyMessage(
      nonce as string,
      signature as string
    );

    if (walletAddress !== decodedAddress.toLowerCase()) { throw new Error('SIGNATURE_VALIDATION_FAILED') }
    next();
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: HTTP_RESPONSE_MESSAGES.ACCESS_DENIED,
      error: null,
    });
  }
};

export default validateAccess;