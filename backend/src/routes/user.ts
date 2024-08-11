import { Router } from "express";
import controller from "../controllers/user-nonce";
const userNonceRouter: Router = Router();

userNonceRouter.get("/user-nonce", controller.getUserNonce);

export default userNonceRouter;