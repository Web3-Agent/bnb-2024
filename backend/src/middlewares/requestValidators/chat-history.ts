import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { CustomRequest } from "../../types/customRequest";
import { error } from "./response";

const chatHistoryRequestSchema = {
    messages: joi.array().required(),
    wallet_address: joi.string().required(),
    type: joi.string().required(),
};


export const chatHistoryRequestValidation = (
    request: CustomRequest,
    response: Response,
    next: NextFunction
) => {
    const requestBodySchema = joi.object(chatHistoryRequestSchema);
    const requestBodyValidation = requestBodySchema.validate(request.body);
    if (requestBodyValidation.error) {
        return error(requestBodyValidation.error, response);
    } else {
        next();
    }
};





export default {
    chatHistoryRequestValidation,
};