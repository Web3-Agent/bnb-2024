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

const transformGasDetails = (gas: any, provider: string) => {
    switch (provider) {
        case DATA_PROVIDER_MAPPING.BLOCKPI: {
            return {
                wei: convertStringToNumber(convertHexToString(gas)) || 'NA',
                gwei: Math.ceil(convertStringToNumber(convertHexToString(gas)) / 1000000000) || 'NA'
            }
        }
        // case DATA_PROVIDER_MAPPING.COVALENTHQ: {
        //     return {
        //         wei: convertStringToNumber(convertHexToString(gas)),
        //         gwei: Math.ceil(convertStringToNumber(convertHexToString(gas)) / 1000000000)
        //     }
        // }
        default:
            throw new Error(HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE)
    }

}


export const rpcGetGasFee = async (rpcUrl: string, method: string = 'eth_gasPrice') => {
    if (!rpcUrl && typeof rpcUrl !== "string") {
        throw new Error(HTTP_RESPONSE_MESSAGES.INVALID_OR_MISSING_RPC_URL);
    }
    try {
        const response = await axios.post(rpcUrl, {
            jsonrpc: "2.0",
            id: payloadId(),
            method,
            params: [],
        });
        return response;
    } catch (error: any) {
        throw new Error(error);
    }
};


export const getGasPrice = async (request: CustomRequest, response: Response) => {
    try {
        let result: any = {}

        const { body } = request;
        let { provider, query: { network } } = body;

        switch (provider) {
            case DATA_PROVIDER_MAPPING.BLOCKPI: {
                const networkConfig: any = getNetworkConfiguration(network, provider);
                result = await rpcGetGasFee(networkConfig.RPC_URL, networkConfig.GAS_PRICE_METHOD);
                result = result?.data?.result || null;
                if (!result) {
                    throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
                }

                result = transformGasDetails(result, provider);
                break;
            }
            // case DATA_PROVIDER_MAPPING.COVALENTHQ: {
            //     const client = new CovalentClient(ENV_VARIABLES.COVALENT_API_KEY!);
            //     result = await client.BaseService.getGasPrices();
            //     result = (result?.data?.items as any) || [];
            //     if (!result?.length) {
            //         throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
            //     }
            //     result = transformGasDetails(result[0], provider);
            //     break;
            // }
            default:
                return response.status(400).json({ success: false, message: HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE });
        }

        result = { ...result, network, };

        return response.status(200).json({
            success: true, message: HTTP_RESPONSE_MESSAGES.GAS_PRICE_DETAILS_FETCHED, data: result, request: body
        });
    } catch (error: any) {
        return response.status(400).json({ success: false, message: error?.message || HTTP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR });
    }
}
export default { getGasPrice }