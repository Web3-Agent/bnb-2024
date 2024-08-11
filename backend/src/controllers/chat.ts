import { Response } from "express";
import { Configuration, OpenAIApi } from 'openai-edge';
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { CustomRequest } from "../types/customRequest";
import { ENV_VARIABLES } from "../configurations/env";
import { generateUUId } from "../utils/ids";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { Readable } from "stream";

export const createChatCompletion = async (request: CustomRequest, response: Response) => {
    try {
        const { messages, functions, function_call, requestId } = request.body;
        const userId = 'DEV_TEST'//user?.email;

        const configuration = new Configuration({
            apiKey: ENV_VARIABLES.OPENAI_API_KEY
        })

        const openai = new OpenAIApi(configuration)

        // Ask OpenAI for a streaming chat completion given the prompt
        const res = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            // model: 'gpt-4',
            stream: true,
            messages,
            functions,
            function_call
        });

        const stream = OpenAIStream(res, {
            async onCompletion(completion) {
                const title = messages.find((m: Message) => m.role !== 'system')?.content.substring(0, 100)
                const id = requestId ?? generateUUId()
                const createdAt = Date.now()
                const path = `/chat/${id}`
                const payload = {
                    id,
                    title,
                    userId,
                    createdAt,
                    path,
                    messages: [
                        ...messages,
                        {
                            content: completion,
                            role: 'assistant'
                        }
                    ]
                }
                // await kv.hmset(`chat:${id}`, payload)
                // await kv.zadd(`user:chat:${userId}`, {
                //     score: createdAt,
                //     member: `chat:${id}`
                // })
            }
        })
        // const readable = new WritableStream({
        //     write() { }
        // });
        // readable.pipe(stream);
        return new StreamingTextResponse(stream)
    } catch (error) {
        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.CHAT_RESPONSE_GENERATION_FAILED, success: false })
    }
}

export default { createChatCompletion }