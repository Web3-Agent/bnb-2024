import { Response } from "express";
import HTTP_RESPONSE_MESSAGES from "../../constants/httpResponseMessages";
export const error = function error(error: any, response: Response) {
  let errorMsg;
  if (typeof error === "string") {
    errorMsg = error;
  } else if (error.details[0].type === "string.regex.base") {
    const errorId = error.details[0].message.split(" ");
    errorMsg = `Invalid ${errorId[0]} ${error.details[0].context.value}`;
  } else if (error.details[0].path.length > 1) {
    errorMsg = `${error.details[0].path[0]} ${error.details[0].message}`;
  } else {
    errorMsg = error.details[0].message.replace(/\"/g, "").trim() + "!";
    errorMsg = errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1);
  }
  return response.status(error.status || 400).json({
    success: false,
    message: errorMsg,
    error: HTTP_RESPONSE_MESSAGES.BAD_REQUEST,
  });
};

export default {
  error,
};