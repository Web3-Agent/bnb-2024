import { Response } from "express";
import axios from "axios";
import { CustomRequest } from "../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { DATA_PROVIDER_MAPPING } from "../constants/dataProvider";

export const getTopLosersTokens = async (
    request: CustomRequest,
    response: Response
) => {
    try {
        const { body } = request;
        let {
            provider,
            query: { network, period = "24h", },
        } = body;
        switch (provider) {
            case DATA_PROVIDER_MAPPING.DEX_TOOLS: {

                const { data } = await axios.get(
                    `https://api.dextools.io/v2/ranking/${network}/losers?period=${period}`,
                    { headers: { 'X-API-Key': process.env.DEX_TOOLS_API_KEY } }
                );
                if (!data) {
                    throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
                }
                // result = transformTokenDetails(result, provider);
                return response.status(200).json({
                    success: true,
                    message: HTTP_RESPONSE_MESSAGES.TOKEN_SCORE_FETCHED,
                    data: data?.data,
                    request: body,
                });
            }
            default:
                return response
                    .status(400)
                    .json({
                        success: false,
                        message: HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE,
                    });
        }

    } catch (error: any) {
        return response
            .status(400)
            .json({
                success: false,
                message: error?.message || HTTP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
            });
    }
};
export default { getTopLosersTokens };
