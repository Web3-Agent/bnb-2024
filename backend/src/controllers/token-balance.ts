import { Response } from "express";
import axios from "axios";
import { CovalentClient } from "@covalenthq/client-sdk";
import { CustomRequest } from "../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { DATA_PROVIDER_MAPPING } from "../constants/dataProvider";
import { ENV_VARIABLES } from "../configurations/env";
import { convertAmountFromRawNumber } from "../helpers/formatters";
const transformTokenDetails = (tokens: any, provider: string) => {
    const data: any = {};
    switch (provider) {
        case DATA_PROVIDER_MAPPING.COVALENTHQ: {
            data.wallet_address = tokens.address;
            data.updated_at = tokens.updated_at;
            data.quote_currency = tokens.quote_currency;
            data.network = tokens.chain_name;
            data.network_id = tokens.chain_id;
            data.items = tokens.items.map((token: any, index: number) => {
                const {
                    contract_decimals,
                    contract_name,
                    contract_ticker_symbol,
                    contract_address,
                    logo_url,
                    balance,
                    quote,
                } = token;
                return {
                    contract_decimals,
                    token: contract_name,
                    symbol: contract_ticker_symbol,
                    contract_address,
                    logo_url,
                    balance: convertAmountFromRawNumber(balance, contract_decimals),
                    price: quote,
                };
            });
            return data;
        }
        default:
            throw new Error(HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE);
    }
};

export const getTokenBalanceForAddress = async (
    request: CustomRequest,
    response: Response
) => {
    try {
        let result: any = {};
        const { body } = request;
        let {
            provider,
            query: { network, walletAddress, quoteCurrency = "USD" },
        } = body;
        switch (provider) {
            case DATA_PROVIDER_MAPPING.COVALENTHQ: {
                const client = new CovalentClient(ENV_VARIABLES.COVALENT_API_KEY!);
                result = await client.BalanceService.getTokenBalancesForWalletAddress(
                    network,
                    walletAddress,
                    {
                        quoteCurrency: quoteCurrency,
                        nft: false,
                        noNftFetch: false,
                        noSpam: false,
                        noNftAssetMetadata: false,
                    }
                );
                result = result?.data || null;
                if (!result) {
                    throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
                }
                result = transformTokenDetails(result, provider);
                break;
            }
            default:
                return response
                    .status(400)
                    .json({
                        success: false,
                        message: HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE,
                    });
        }

        result = { ...result, network, wallet_address: walletAddress };

        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.TOKEN_BALANCE_FETCHED,
            data: result,
            request: body,
        });
    } catch (error: any) {
        return response
            .status(400)
            .json({
                success: false,
                message: error?.message || HTTP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
            });
    }
};
export default { getTokenBalanceForAddress };
