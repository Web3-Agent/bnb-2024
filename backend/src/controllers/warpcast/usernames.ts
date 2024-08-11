import { Response } from "express";
import axios from "axios";
import { CustomRequest } from "../../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../../constants/httpResponseMessages";

export const getUsersByUsername = async (
    request: CustomRequest,
    response: Response
) => {
    try {
        const { body } = request;
        let {
            query: { username = "", limit = 10 },
        } = body;
        if (!username?.length) {
            throw new Error('Username fid is missing');
        }
        const { data } = await axios.get(
            `https://api.neynar.com/v2/farcaster/user/search?&limit=${limit}&q=${username}`,
            { headers: { 'api_key': process.env.NEYNAR_API_KEY } }
        );
        if (!data) {
            throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
        }
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.REQUEST_SUCCESSFULLY,
            data: data?.result?.users || [],
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
export default { getUsersByUsername };
