import { Response } from "express";
import { Configuration, OpenAIApi } from 'openai-edge';
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { CustomRequest } from "../types/customRequest";
import { ENV_VARIABLES } from "../configurations/env";
import { generateUUId } from "../utils/ids";
import { create, fetch, deleteById } from '../providers/chat-history';
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";

export const createChatHistory = async (request: CustomRequest, response: Response) => {
    try {
        const { messages, wallet_address, type } = request.body;
        const data = await create({ wallet_address, messages, type })
        return response.status(200).json({ message: HTTP_RESPONSE_MESSAGES.CHAT_HISTORY_CREATE_SUCCESS, success: true, data })
    } catch (error) {
        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.CHAT_HISTORY_CREATE_FAILED, success: false })
    }
}
export const getChatHistory = async (request: CustomRequest, response: Response) => {
    try {
        const { wallet_address, type } = request.query;
        const query: any = { isActive: true };
        if (wallet_address) {
            query['wallet_address'] = { '$regex': wallet_address, $options: 'i' }
        }
        if (type) {
            query['type'] = { '$regex': type, $options: 'i' }
        }
        const data = await fetch(query);
        return response.status(200).json({ message: HTTP_RESPONSE_MESSAGES.CHAT_HISTORY_FETCH_SUCCESS, success: true, data })
    } catch (error) {
        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.CHAT_HISTORY_FETCH_FAILED, success: false })
    }
}

export const deleteChatHistory = async (request: CustomRequest, response: Response) => {
    try {
        const { _id } = request.params;
        if (!_id) {
            response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.ID_REQUIRED, success: false })
        }
        const data = await deleteById(_id);
        return response.status(200).json({ message: HTTP_RESPONSE_MESSAGES.CHAT_HISTORY_DELETE_FAILURE, success: true, data })
    } catch (error) {
        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.CHAT_HISTORY_FETCH_FAILED, success: false })
    }
}

export default { createChatHistory, getChatHistory, deleteChatHistory }