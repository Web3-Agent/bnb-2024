import { Response } from "express";
import axios from "axios";
import { CustomRequest } from "../../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../../constants/httpResponseMessages";

export const getUsersByFID = async (
    request: CustomRequest,
    response: Response
) => {
    try {
        const { body } = request;
        let {
            query: { fids = "", },
        } = body;
        if (!fids) {
            throw new Error('Username/Viewer fid is missing');
        }
        const { data } = await axios.get(
            `https://api.neynar.com/v2/farcaster/user/bulk?&fids=${parseInt(fids)}`,
            { headers: { 'api_key': process.env.NEYNAR_API_KEY } }
        );
        if (!data) {
            throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
        }
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.REQUEST_SUCCESSFULLY,
            data: data?.users.length ? data?.users[0] : {},
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
export default { getUsersByFID };
