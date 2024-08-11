import { Response } from "express";
import axios from 'axios'
import { CovalentClient } from "@covalenthq/client-sdk";
import { CustomRequest } from "../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { convertStringToNumber, convertHexToString, convertNumberToString } from "../helpers/formatters";
import { ENV_VARIABLES } from "../configurations/env";
import { payloadId } from "../utils/ids";
import { DATA_PROVIDER_MAPPING } from "../constants/dataProvider";
import { getNetworkConfiguration } from "../helpers/networkConfigs";

const transformTransactionDetails = (txn: any, provider: string) => {
    switch (provider) {
        case DATA_PROVIDER_MAPPING.BLOCKPI: {
            return {
                block_signed_at: txn?.block_signed_at || 'NA',
                block_height: convertHexToString(txn?.blockNumber) || 'NA',
                block_hash: txn.blockHash || 'NA',
                from_address: txn.from || 'NA',
                to_address: txn.to || 'NA',
                value: convertNumberToString(txn.value) || 'NA',
                gas_price: convertHexToString(txn.gasPrice) || 'NA',
                gas_spent: convertHexToString(txn.gas) || 'NA',
                miner_address: txn?.miner_address || 'NA',
                value_in_wei: convertStringToNumber(convertHexToString(txn?.value)) || 'NA',
                value_in_gwei: Math.ceil(convertStringToNumber(convertHexToString(txn?.value)) / 1000000000) || 'NA',
                value_in_ether: convertStringToNumber(convertHexToString(txn?.value)) / 1_000_000_000_000_000_000 || 'NA'
            }
        }
        case DATA_PROVIDER_MAPPING.COVALENTHQ:
            return {
                block_signed_at: txn?.block_signed_at || 'NA',
                block_height: txn?.block_height || 'NA',
                block_hash: txn?.block_hash || 'NA',
                from_address: txn?.from_address || 'NA',
                to_address: txn?.to_address || 'NA',
                value: convertNumberToString(txn.value) || 'NA',
                gas_price: convertNumberToString(txn?.gas_price) || 'NA',
                gas_spent: convertNumberToString(txn?.gas_spent) || 'NA',
                miner_address: txn?.miner_address || 'NA',
                value_in_wei: convertStringToNumber(convertHexToString(txn?.value)) || 'NA',
                value_in_gwei: Math.ceil(convertStringToNumber(convertHexToString(txn?.value)) / 1000000000) || 'NA',
                value_in_ether: convertStringToNumber(convertHexToString(txn?.value)) / 1_000_000_000_000_000_000 || 'NA',
            }
        default:
            throw new Error(HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE)

    }

}

export const rpcGetTransactionByHash = async (rpcUrl: string, method: string = 'eth_getTransactionByHash', hash: string) => {
    try {
        if (!rpcUrl && typeof rpcUrl !== "string") {
            throw new Error(HTTP_RESPONSE_MESSAGES.INVALID_OR_MISSING_RPC_URL);
        }
        const response = await axios.post(rpcUrl, {
            jsonrpc: "2.0",
            id: payloadId(),
            method,
            params: [hash],
        });
        return response;
    } catch (error: any) {
        throw new Error(error);
    }
};


export const getTransactionDetailsByHash = async (request: CustomRequest, response: Response) => {
    try {
        let result: any = {}

        const { body } = request;
        let { provider, query: { network, hash } } = body;

        switch (provider) {
            case DATA_PROVIDER_MAPPING.BLOCKPI: {
                const networkConfig: any = getNetworkConfiguration(network, provider);
                result = await rpcGetTransactionByHash(networkConfig.RPC_URL, networkConfig.TRANSACTION_DETAILS_BY_HASH_METHOD, hash);
                result = result?.data?.result || null;
                if (!result) {
                    throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
                }

                result = transformTransactionDetails(result, provider);
                break;
            }
            case DATA_PROVIDER_MAPPING.COVALENTHQ: {
                const client = new CovalentClient(ENV_VARIABLES.COVALENT_API_KEY!);
                result = await client.TransactionService.getTransaction(network, hash);
                result = (result?.data?.items as any) || [];
                if (!result?.length) {
                    throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
                }
                result = transformTransactionDetails(result[0], provider);
                break;
            }
            default:
                return response.status(400).json({ success: false, message: HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE });
        }

        result = { ...result, network, hash: hash };

        return response.status(200).json({
            success: true, message: HTTP_RESPONSE_MESSAGES.TRANSACTION_DETAILS_FETCHED, data: result, request: body
        });
    } catch (error: any) {
        return response.status(400).json({ success: false, message: error?.message || HTTP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR });
    }
}
export default { getTransactionDetailsByHash }