
import { Response } from "express";
import axios from "axios";
import { CovalentClient } from "@covalenthq/client-sdk";
import { CustomRequest } from "../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { DATA_PROVIDER_MAPPING } from "../constants/dataProvider";
import { ENV_VARIABLES } from "../configurations/env";
import { convertAmountFromRawNumber } from "../helpers/formatters";

export const getLatestTokenList = async (
    request: CustomRequest,
    response: Response
) => {
    try {
        let result: any = {};
        const { body } = request;
        let {
            provider,
            query: { limit = 10 },
        } = body;
        switch (provider) {
            case DATA_PROVIDER_MAPPING.COIN_MARKET_CAP: {
                result = await axios.get(
                    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
                    {
                        headers: {
                            'X-CMC_PRO_API_KEY': ENV_VARIABLES.X_CMC_PRO_API_KEY,
                        },
                        params: {
                            limit, // Fetch only the top 10 cryptocurrencies
                        },
                    }
                );
                result = result?.data;
                if (!result) {
                    throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
                }
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
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.LATEST_TOKEN_FETCHED,
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
export default { getLatestTokenList };