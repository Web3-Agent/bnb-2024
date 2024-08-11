import { Response } from "express";
import axios from 'axios'
import { CovalentClient } from "@covalenthq/client-sdk";
import { CustomRequest } from "../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { convertStringToNumber, convertHexToString } from "../helpers/formatters";
import { ENV_VARIABLES } from "../configurations/env";
import { payloadId } from "../utils/ids";
import { DATA_PROVIDER_MAPPING } from "../constants/dataProvider";
import { getNetworkConfiguration } from "../helpers/networkConfigs";

const transformBlockDetails = (block: any, provider: string) => {
    switch (provider) {
        case DATA_PROVIDER_MAPPING.BLOCKPI: {
            return {
                block_hash: block.hash,
                signed_at: convertHexToString(block.timestamp),
                height: convertHexToString(block.number),
                block_parent_hash: block.parentHash,
                miner_address: block.miner,
                gas_used: convertHexToString(block.gasUsed),
                gas_limit: convertHexToString(block.gasUsed),
                mining_cost: convertHexToString(block.blobGasUsed),
            }
        }
        case DATA_PROVIDER_MAPPING.COVALENTHQ: {
            return {
                block_hash: block.block_hash,
                signed_at: block.signed_at,
                height: block.height,
                block_parent_hash: block.block_parent_hash,
                miner_address: block.miner_address,
                gas_used: block.gas_used,
                gas_limit: block.gas_limit,
                mining_cost: block.mining_cost,
            }
        }
        default:
            throw new Error(HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE)
    }

}

export const rpcGetBlockDetailsByNumber = async (rpcUrl: string, method: string = 'eth_getBlockByNumber', blockNumber: any = 'latest') => {
    if (!rpcUrl && typeof rpcUrl !== "string") {
        throw new Error(HTTP_RESPONSE_MESSAGES.INVALID_OR_MISSING_RPC_URL);
    }
    try {
        const response = await axios.post(rpcUrl, {
            jsonrpc: "2.0",
            id: payloadId(),
            method,
            params: [blockNumber, true],
        });
        return response;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getBlockDetailsByNumber = async (request: CustomRequest, response: Response) => {
    try {
        let result: any = {}

        const { body } = request;
        let { provider, query: { network, blockNumber } } = body;
        blockNumber = isNaN(blockNumber) ? 'latest' : convertStringToNumber(blockNumber);

        switch (provider) {
            case DATA_PROVIDER_MAPPING.BLOCKPI: {
                const networkConfig: any = getNetworkConfiguration(network, provider);
                result = await rpcGetBlockDetailsByNumber(networkConfig.RPC_URL, networkConfig.BLOCK_DETAILS_BY_NUMBER_METHOD, blockNumber);
                result = result?.data?.result || null;
                if (!result) {
                    throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
                }
                result = transformBlockDetails(result, provider);
                break;
            }
            case DATA_PROVIDER_MAPPING.COVALENTHQ: {
                const client = new CovalentClient(ENV_VARIABLES.COVALENT_API_KEY!);
                result = await client.BaseService.getBlock(network, blockNumber);
                result = (result?.data?.items as any) || [];
                if (!result?.length) {
                    throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
                }
                result = transformBlockDetails(result[0], provider);
                break;
            }
            default:
                return response.status(400).json({ success: false, message: HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE });
        }

        result = { ...result, network, block_number: blockNumber };

        return response.status(200).json({
            success: true, message: HTTP_RESPONSE_MESSAGES.BLOCK_DETAILS_FETCHED, data: result, request: body
        });
    } catch (error: any) {
        return response.status(400).json({ success: false, message: error?.message || HTTP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR });
    }
}
export default { getBlockDetailsByNumber }