import { Router } from "express";
import controllers from "../controllers/image-generator";
import validator from "../middlewares/requestValidators/chat";
const ImageGeneratorRoute: Router = Router();

ImageGeneratorRoute.post(
    "/",
    controllers.generateImages,
);


export default ImageGeneratorRoute;