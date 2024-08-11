import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { CustomRequest } from "../../types/customRequest";
import { error } from "./response";

const compileContractRequestSchema = {
    contractName: joi.string().trim().optional(),
    sourceCode: joi.string().trim().required(),
    constructorArgs: joi.array().optional(),
    chainName: joi.string().trim().optional(),
};


export const compileContractValidation = (
    request: CustomRequest,
    response: Response,
    next: NextFunction
) => {
    const requestBodySchema = joi.object(compileContractRequestSchema);
    const requestBodyValidation = requestBodySchema.validate(request.body);
    if (requestBodyValidation.error) {
        return error(requestBodyValidation.error, response);
    } else {
        next();
    }
};

export default {
    compileContractValidation,
};