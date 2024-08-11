import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { CustomRequest } from "../../types/customRequest";
import { error } from "./response";

const chatRequestSchema = {
    messages: joi.array().required(),
    functions: joi.array().required(),
    function_call: joi.string().optional(),
    requestId: joi.string().trim().optional(),
};


export const chatRequestValidation = (
    request: CustomRequest,
    response: Response,
    next: NextFunction
) => {
    const requestBodySchema = joi.object(chatRequestSchema);
    const requestBodyValidation = requestBodySchema.validate(request.body);
    if (requestBodyValidation.error) {
        return error(requestBodyValidation.error, response);
    } else {
        next();
    }
};





export default {
    chatRequestValidation,
};