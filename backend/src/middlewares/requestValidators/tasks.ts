import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { CustomRequest } from "../../types/customRequest";
import { error } from "./response";

const addTaskRequestSchema = {
  title: joi.string().trim().required(),
  description: joi.string().trim().optional(),
  status: joi
  .string()
  .allow("PENDING", "COMPLETED")
  .trim()
  .optional(),
};

const updateTaskRequestSchema = {
  title: joi.string().trim().optional(),
  description: joi.string().trim().optional(),
  status: joi
    .string()
    .allow("PENDING", "COMPLETED")
    .trim()
    .optional(),
  user: joi.string().optional(),
  isActive: joi.boolean().optional(),
  createdAt: joi.date().optional(),
  updatedAt: joi.date().optional(),
  __v: joi.number().optional(),
};

const paramsRequestSchema = {
  taskId: joi.string().min(24).trim().required(),
  status: joi
    .string()
    .allow("PENDING", "COMPLETED")
    .trim()
    .optional(),
};

export const addTaskValidation = (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  const requestBodySchema = joi.object(addTaskRequestSchema);
  const requestBodyValidation = requestBodySchema.validate(request.body);
  if (requestBodyValidation.error) {
    return error(requestBodyValidation.error, response);
  } else {
    next();
  }
};

export const updateTaskValidation = (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  const requestBodySchema = joi.object(updateTaskRequestSchema);
  const requestBodyValidation = requestBodySchema.validate(request.body);
  if (requestBodyValidation.error) {
    return error(requestBodyValidation.error, response);
  }
  next();
};

export const validateParams = (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  const requestParamsSchema = joi.object(paramsRequestSchema);
  const requestParamsValidation = requestParamsSchema.validate(request.params);
  if (requestParamsValidation.error) {
    return error(requestParamsValidation.error, response);
  } else {
    next();
  }
};

export default {
  addTaskValidation,
  updateTaskValidation,
  validateParams,
};