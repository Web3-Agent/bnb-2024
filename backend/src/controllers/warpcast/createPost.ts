import { Response } from "express";
import axios from "axios";
import { CustomRequest } from "../../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../../constants/httpResponseMessages";

export const createPost = async (
    request: CustomRequest,
    response: Response
) => {
    try {
        const { body } = request;
        let {
            query: { signer_uuid = "", text = "", },
        } = body;
        if (!text || !signer_uuid) {
            throw new Error('Singer/Text is missing');
        }
        const payload = {
            signer_uuid,
            text
        }
        const { data } = await axios.post(
            `https://api.neynar.com/v2/farcaster/cast`,
            payload,
            { headers: { 'api_key': process.env.NEYNAR_API_KEY } }
        );
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.REQUEST_SUCCESSFULLY,
            data,
            request: body,
        });
    } catch (error: any) {
        console.log('👉🏻 Line 37 : ', error);
        return response
            .status(400)
            .json({
                success: false,
                message: error?.message || HTTP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
            });
    }
};
export default { createPost };
