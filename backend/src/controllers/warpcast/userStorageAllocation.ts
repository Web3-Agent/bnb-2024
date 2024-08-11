import { Response } from "express";
import axios from "axios";
import { CustomRequest } from "../../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../../constants/httpResponseMessages";

export const getUserStorageAllocation = async (
    request: CustomRequest,
    response: Response
) => {
    try {
        const { body } = request;
        let {
            query: { username = "", limit = 1 },
        } = body;
        if (!username) {
            throw new Error('Username fid is missing');
        }
        const { data } = await axios.get(
            `https://api.neynar.com/v2/farcaster/user/search?&limit=${limit}&q=${username}`,
            { headers: { 'api_key': process.env.NEYNAR_API_KEY } }
        );
        if (!data?.result?.users?.length) {
            throw new Error(HTTP_RESPONSE_MESSAGES.NO_DATA_FOUND);
        }
        const user = data?.result?.users[0];
        let storage = await axios.get(
            `https://api.neynar.com/v2/farcaster/storage/allocations?fid=${user.fid}`,
            { headers: { 'api_key': process.env.NEYNAR_API_KEY } }
        );
        const {
            allocations, total_active_units
        } = storage.data;
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.REQUEST_SUCCESSFULLY,
            data: {
                user,
                allocations,
                total_active_units,
            },
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
export default { getUserStorageAllocation };
