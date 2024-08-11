
import { Response } from "express";
import axios from 'axios'
import { CustomRequest } from "../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { ENV_VARIABLES } from "../configurations/env";

export const retrievesBadgeHolders = async (request: CustomRequest, response: Response) => {
    try {
        const { query: { badge } } = request;
        if (!badge) {
            return response.status(400).json({ success: false, message: 'NO_BADGE_FOUND' });
        }

        const { data: { data } } = await axios.get(`https://profile.unstoppabledomains.com/api/badges/${badge}/holders`, { headers: { "Authorization": `Bearer ${ENV_VARIABLES.UNSTOPPABLE_TOKEN}`, "x-api-key": ENV_VARIABLES.UNSTOPPABLE_TOKEN } });
        return response.status(200).json({ success: false, message: HTTP_RESPONSE_MESSAGES.ACTION_SUCCESS, data });
    } catch (error: any) {
        return response.status(400).json({ success: false, message: error?.message || HTTP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR });

    }
}
export default { retrievesBadgeHolders };