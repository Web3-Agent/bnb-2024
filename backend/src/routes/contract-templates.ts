import { Router } from "express";
import controllers from "../controllers/contract-templates";
const ContractTemplatesRouter: Router = Router();

ContractTemplatesRouter.post(
    "/",
    // validateAccess,
    // validator.compileContractValidation,
    controllers.createContractTemplate
);
ContractTemplatesRouter.get(
    "/",
    // validateAccess,
    // validator.compileContractValidation,
    controllers.getContractTemplates
);
ContractTemplatesRouter.get(
    "/:id",
    // validateAccess,
    // validator.compileContractValidation,
    controllers.getContractTemplate
);
ContractTemplatesRouter.put(
    "/:id",
    // validateAccess,
    // validator.compileContractValidation,
    controllers.updateContractTemplate
);
ContractTemplatesRouter.delete(
    "/:id",
    // validateAccess,
    // validator.compileContractValidation,
    controllers.deleteContractTemplate
);

export default ContractTemplatesRouter;