import { Router, Response } from "express";
import controllers from "../controllers/compile-contract";
import { CustomRequest } from "../types/customRequest";
import { getSendERC20TokenCalldata, getApproveERC20TokenCalldata, getSwapErc20TokenToTokenCalldata ,getUnwrapTokenCalldata, getWrapTokenCalldata, getVenusDepositCalldata, getVenusRedeemCalldata, getSwapEnsoCalldata, getLifiSwap, getLimitOrderApi, getChainlinkCCIPCalldata } from "../controllers/calldata-txn";


const TxnApiRouter: Router = Router();

const ACTIONS = {
    SEND_ERC20_TOKEN: 'SEND_ERC20_TOKEN',
    APPROVE_ERC20_TOKEN: "APPROVE_ERC20_TOKEN",
    SWAP_ERC20_TOKEN: "SWAP_ERC20_TOKEN",
    WRAP_TOKEN: "WRAP_TOKEN",
    UNWRAP_TOKEN: "UNWRAP_TOKEN",
    VENUS_DEPOSIT: "VENUS_DEPOSIT",
    VENUS_REDEEM: "VENUS_REDEEM",
    ENSO_SWAP: "ENSO_SWAP",
    LIFI_SWAP : "LIFI_SWAP",
    LIMIT_ORDER: "LIMIT_ORDER",
    CHAINLINK_CCIP: "CHAINLINK_CCIP",
    DEPLOY_L1_TOKEN: "DEPLOY_L1_TOKEN",
    DEPLOY_L2_TOKEN: "DEPLOY_L2_TOKEN"
}

const txnController = (request: any, response: any) => {
    try {
        const { body } = request;
        const { action } = body;
        switch (action) {
            case ACTIONS.SEND_ERC20_TOKEN:
                return getSendERC20TokenCalldata(request, response);
            case ACTIONS.APPROVE_ERC20_TOKEN:
                return getApproveERC20TokenCalldata(request, response);
            case ACTIONS.SWAP_ERC20_TOKEN:
                return getSwapErc20TokenToTokenCalldata(request, response);
            case ACTIONS.WRAP_TOKEN:
                return getWrapTokenCalldata(request, response);
            case ACTIONS.UNWRAP_TOKEN:
                return getUnwrapTokenCalldata(request, response);
            case ACTIONS.VENUS_DEPOSIT:
                return getVenusDepositCalldata(request, response);
            case ACTIONS.VENUS_REDEEM:
                return getVenusRedeemCalldata(request, response);
            case ACTIONS.LIFI_SWAP:
                return getLifiSwap(request,response);
            case ACTIONS.ENSO_SWAP:
                return getSwapEnsoCalldata(request, response);
            case ACTIONS.LIMIT_ORDER:
                return getLimitOrderApi(request,response);
            case ACTIONS.CHAINLINK_CCIP:
                return getChainlinkCCIPCalldata(request,response);
            // case ACTIONS.DEPLOY_L1_TOKEN:
            //     return deployCrossChainTokenL1(request,response);
            // case ACTIONS.DEPLOY_L2_TOKEN:
            //     return deployCrossChainTokenL2(request,response);
            default:
                return response.status(400).json({
                    success: false,
                    message: 'UNKNOWN_REQUEST'
                })
        }
    } catch (error) {
        return response.status(400).json({
            success: false,
            message: 'UNABLE_TO_PROCESS_REQUEST'
        })
    }
}

TxnApiRouter.post(
    "/",
    // validateAccess,
    txnController
    // validator.compileContractValidation,
    // controllers.compileContract
);


export default TxnApiRouter;