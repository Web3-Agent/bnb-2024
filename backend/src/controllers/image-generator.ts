import { Response } from "express";
import { CustomRequest } from "../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import axios from "axios";

export const generateImages = async (request: CustomRequest, response: Response) => {
    try {
        const { prompt } = request.body;
        const result = await axios.post('https://api.openai.com/v1/images/generations', {
            model: 'dall-e-3',
            // model: 'gpt-4',
            prompt,
            n: 1,
            size: "1024x1024"
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        response.status(200).json(result.data);
    } catch (error: any) {
        console.log(error.response)
        return response.status(400).json({ success: false, message: error?.message || HTTP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR });

    }
}
export default { generateImages }