import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { error } from "./response";

const loginRequestSchema = {
  email: joi.string().email().trim().required(),
  password: joi.string()
  .required()
};

const registerRequestSchema = {
    email: joi.string().email().trim().required(),
    password: joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'\[\]])/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
  name: joi.string().trim().required(),
};

export const loginValidation = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const requestBodySchema = joi.object(loginRequestSchema);
  const requestBodyValidation = requestBodySchema.validate(request.body);
  if (requestBodyValidation.error) {
    return error(requestBodyValidation.error, response);
  } else {
    next();
  }
};
export const registerValidation = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const requestBodySchema = joi.object(registerRequestSchema);
  const requestBodyValidation = requestBodySchema.validate(request.body);
  if (requestBodyValidation.error) {
    return error(requestBodyValidation.error, response);
  } else {
    next();
  }
};
export default {
  loginValidation,
  registerValidation,
};