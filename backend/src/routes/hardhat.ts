import { Router } from "express";
import controllers from "../controllers/hardhat";
import validator from "../middlewares/requestValidators/chat";
const HardhatRoute: Router = Router();

HardhatRoute.post(
    "/",
    // validateToken,
    // validator.chatRequestValidation,
    controllers.downloadHardhatProject,
);


export default HardhatRoute;