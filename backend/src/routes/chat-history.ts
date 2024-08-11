import { Router } from "express";
import controllers from "../controllers/chat-history";
import validator from "../middlewares/requestValidators/chat-history";
const ChatHistoryRouter: Router = Router();

ChatHistoryRouter.post(
    "/",
    // validateToken,
    validator.chatHistoryRequestValidation,
    controllers.createChatHistory
);
ChatHistoryRouter.get(
    "/",
    // validateToken,
    controllers.getChatHistory
);
ChatHistoryRouter.delete(
    "/:_id",
    // validateToken,
    controllers.deleteChatHistory
);

export default ChatHistoryRouter;