import { Response } from "express";
import axios from "axios";
import { CustomRequest } from "../../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../../constants/httpResponseMessages";

export const getFollowersByFID = async (
    request: CustomRequest,
    response: Response
) => {
    try {
        const { body } = request;
        let {
            query: { fid = "", },
        } = body;
        if (!fid) {
            throw new Error('fid is missing');
        }
        const { data } = await axios.get(
            `https://api.neynar.com/v2/farcaster/followers?fid=${parseInt(fid)}`,
            { headers: { 'api_key': process.env.NEYNAR_API_KEY } }
        );
        if (!data) {
            throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
        }
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.REQUEST_SUCCESSFULLY,
            data: data?.users || [],
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
export default { getFollowersByFID };
