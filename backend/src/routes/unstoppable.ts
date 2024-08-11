import { Router } from "express";
import controller from "../controllers/unstoppable";
const unstoppableRouter: Router = Router();
unstoppableRouter.get("/badges-holders", controller.retrievesBadgeHolders);

export default unstoppableRouter;