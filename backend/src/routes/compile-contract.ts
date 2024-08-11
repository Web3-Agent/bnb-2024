import { Router } from "express";
import controllers from "../controllers/compile-contract";
import validator from "../middlewares/requestValidators/compile-contract";
import validateAccess from "../middlewares/validateToken";
const CompileContractRouter: Router = Router();

CompileContractRouter.post(
    "/",
    // validateAccess,
    // validator.compileContractValidation,
    controllers.compileContract
);


export default CompileContractRouter;