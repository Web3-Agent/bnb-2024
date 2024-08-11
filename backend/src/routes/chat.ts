import { Router } from "express";
import controllers from "../controllers/chat";
import validator from "../middlewares/requestValidators/chat";
const ChatRouter: Router = Router();

ChatRouter.post(
    "/",
    // validateToken,
    validator.chatRequestValidation,
    controllers.createChatCompletion
);


export default ChatRouter;