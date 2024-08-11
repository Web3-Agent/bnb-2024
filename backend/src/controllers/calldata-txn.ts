import { ethers } from "ethers";
import { ERC20abi } from "../constants/abi/ERC20-ABI";
import { WETHabi } from "../constants/abi/WETH-ABI";
import { PancakeSwapAbi } from "../constants/abi/PancakeSwap-ABI";
import { VenusAbi } from "../constants/abi/Venus-ABI";
import { LimitOrderAbi } from "../constants/abi/LimitOrder-ABI";
import { chainlinkCCIPRouterABI } from "../constants/abi/ChainlinkRouter-ABI";
import { Request, Response } from "express";
import { CONTRACT_ADDRESSES } from "../constants/contractAddresses";
import { ENV_VARIABLES } from "../configurations/env";
import { TOKEN_REGISTRY , PROTOCOL_ADDRESS_REGISTRY, CHAINLINK_CCIP_REGISTRY } from "../constants/tokenRegistry";
import axios from "axios";
import qs from "qs";
import { l1TokenFactoryABI } from "../constants/abi/L1TokenFactory-ABI";
import { l2TokenFactoryABI } from "../constants/abi/L2TokenFactory-ABI";

export const getApproveERC20TokenCalldata = async (request: Request, response: Response) => {
    try {
        let registry:any = TOKEN_REGISTRY;
        const {userAddress, chainId, tokenSymbol, toAddress, amount} = request.body;
        let token = registry[chainId][tokenSymbol];

        const erc20Interface = new ethers.Interface(ERC20abi);
        const encodedCall = erc20Interface.encodeFunctionData("approve", [toAddress, amount]);
        console.log(encodedCall);
        const txnInfo = {
            action: "approve",
            from: userAddress,
            token: token,
            interactedWith: token,
            amount: amount
        }
        response.status(200).json({ message: "APPROVAL SUCCESS", success: true, data: [{ calldata: encodedCall, to: token, from: userAddress, value: 0 ,txnData: txnInfo }]})
    } catch (e) {
        response.status(400).json({ message: "APPROVAL FAILED", success: false, data: {} });
        console.log(e);
    }
}

export const getSendERC20TokenCalldata = async (request: Request, response: Response) => {
    try {
        const { userAddress, chainId ,tokenSymbol, toAddress, amount } = request.body;
        let registry:any = TOKEN_REGISTRY;
        let token = registry[chainId][tokenSymbol];

        // Add logic for native token

        // if(token == '0x0000000000000000000000000000000000000000'){
        //     response.status(200).json({ message: "TRANSFER SUCCESS", success: true, data: { calldata: encodedCall, to: token, from: userAddress, value: 0 ,txnData: txnInfo } });
        // }

        const erc20Interface = new ethers.Interface(ERC20abi);
        const encodedCall = erc20Interface.encodeFunctionData("transfer", [toAddress, amount])
        console.log(encodedCall);
        const txnInfo = {
            action: "transfer",
            from: userAddress,
            token: token,
            interactedWith: token,
            toAddress: toAddress,
            amount: amount
        }
        response.status(200).json({ message: "TRANSFER SUCCESS", success: true, data: [{ calldata: encodedCall, to: token, from: userAddress, value: 0 ,txnData: txnInfo }] });
    } catch (e) {
        response.status(400).json({ message: "TRANSFER FAILED", success: false, data: {e} });
        console.log(e);
    }
}

export const getWrapTokenCalldata = async (request: Request, response: Response) => {
    try {
        const { userAddress, chainId ,amount, tokenSymbol } = request.body;
        let registry:any = TOKEN_REGISTRY;
        let token = registry[chainId][tokenSymbol];

        let tokenWrapped = tokenSymbol == "ETH"? registry[chainId]["WETH"]:  registry[chainId]["WBNB"];

        const wETHInterface = new ethers.Interface(WETHabi);
        const encodedCall = wETHInterface.encodeFunctionData("deposit", [])
        console.log(encodedCall);
        const txnInfo = {
            action: "deposit",
            from: userAddress,
            token: tokenWrapped,
            interactedWith: tokenWrapped,
            amount: amount
        }
        response.status(200).json({ message: "WRAPPING SUCCESS", success: true, data: [{ calldata: encodedCall, to: tokenWrapped, from: userAddress, value: amount ,txnData: txnInfo }] });
    } catch (e) {
        response.status(400).json({ message: "WRAPPING FAILED", success: false, data: {} });
        console.log(e);
    }
}

export const getUnwrapTokenCalldata = async (request: Request, response: Response) => {
    try {
        const { userAddress,chainId ,amount ,tokenSymbol} = request.body;
        let registry:any = TOKEN_REGISTRY;
        let token = registry[chainId][tokenSymbol];

        const wETHInterface = new ethers.Interface(WETHabi);
        const encodedCall = wETHInterface.encodeFunctionData("withdraw", [amount])
        console.log(encodedCall);
        const txnInfo = {
            action: "withdraw",
            from: userAddress,
            token: token,
            interactedWith: token,
            amount: amount
        }
        response.status(200).json({ message: "UNWRAPPING SUCCESS", success: true, data: [{ calldata: encodedCall, to:token, from: userAddress, value: 0 ,txnData: txnInfo}] });
    } catch (e) {
        response.status(400).json({ message: "UNWRAPPING FAILED", success: false, data: {} });
        console.log(e);
    }
}

export const getSwapErc20TokenToTokenCalldata = async (request: Request, response: Response) => {
    try {
        const { userAddress, chainId,fromTokenSymbol, toTokenSymbol, amount, slippage } = request.body;

        console.log({ userAddress, chainId,fromTokenSymbol, toTokenSymbol, amount, slippage })
        let registry:any = TOKEN_REGISTRY;
        let protocolRegistry: any = PROTOCOL_ADDRESS_REGISTRY;
        let tokenA = registry[chainId][fromTokenSymbol];
        let tokenB = registry[chainId][toTokenSymbol];
        let router = protocolRegistry[chainId].UniSwapV2;

        let callDataArray = [];

        //APPROVE: 

        //SWAPPING 
        // note: TO ADD SLIPPAGE LOGIC 
        // const minAmount = (ethers.toBigInt(amount) * (ethers.toBigInt(10000) - ethers.toBigInt(slippage))) / ethers.toBigInt(10000);
        let minAmount = 0;
        const pancakeSwapInterface = new ethers.Interface(PancakeSwapAbi);
        let encodedCall;
        let txnInfo;
        if(fromTokenSymbol == "ETH" || fromTokenSymbol == "BNB"){
            let tokenWrapped = fromTokenSymbol == "ETH"? registry[chainId]["WETH"]:  registry[chainId]["WBNB"];
            encodedCall = pancakeSwapInterface.encodeFunctionData("swapExactETHForTokens", [minAmount, [tokenWrapped, tokenB], userAddress, (Date.now() + 30).toString()])

            txnInfo = {
                action: "swapExactETHForTokens",
                from: userAddress,
                token: tokenA,
                interactedWith: router,
                amount: amount
            }
            callDataArray.push({calldata: encodedCall, to: router, from: userAddress, value: amount ,txnData: txnInfo})
            console.log(callDataArray)
        }else{
            const erc20Interface = new ethers.Interface(ERC20abi);
            const encodedCallApprove = erc20Interface.encodeFunctionData("approve", [router, amount]);
            console.log(encodedCallApprove);
            const txnInfoApprove = {
                action: "approve",
                from: userAddress,
                token: tokenA,
                interactedWith: tokenA,
                amount: amount
            }
            callDataArray.push({ calldata: encodedCallApprove, to: tokenA, from: userAddress, value: 0 ,txnData: txnInfoApprove})

            encodedCall = pancakeSwapInterface.encodeFunctionData("swapExactTokensForTokens", [amount, minAmount, [tokenA, tokenB], userAddress, (Date.now() + 30).toString()])
            console.log(encodedCall);
            txnInfo = {
                action: "swapExactTokensForTokens",
                from: userAddress,
                token: tokenA,
                interactedWith: router,
                amount: amount
            }
    
            callDataArray.push({calldata: encodedCall, to: router, from: userAddress, value: 0 ,txnData: txnInfo})
            console.log(callDataArray)
        }
       
        response.status(200).json({ message: "SWAPPING SUCCESS", success: true, data: callDataArray });
    } catch (e) {
        response.status(400).json({ message: "SWAPPING FAILED", success: false, data: {} });
        console.log(e);
    }
}

export const getVenusDepositCalldata = async (request: Request, response: Response) => {
    try {
        const { userAddress, fromToken, amount } = request.body;
        const venusInterface = new ethers.Interface(VenusAbi);
        const encodedCall = venusInterface.encodeFunctionData("mint", [amount])
        console.log(encodedCall);
        const txnInfo = {
            action: "mint",
            from: userAddress,
            token: fromToken,
            interactedWith: fromToken,
            amount: amount
        }
        response.status(200).json({ message: "VENUS DEPOSIT SUCCESS", success: true, data: { calldata: encodedCall, to: fromToken, from: userAddress, value: 0 ,txnData: txnInfo} });
    } catch (e) {
        response.status(400).json({ message: "VENUS DEPOSIT FAILED", success: false, data: {} });
        console.log(e);
    }
}

export const getVenusRedeemCalldata = async (request: Request, response: Response) => {
    try {
        const { userAddress, fromToken, amount } = request.body;
        const venusInterface = new ethers.Interface(VenusAbi);
        const encodedCall = venusInterface.encodeFunctionData("redeem", [amount])
        console.log(encodedCall);
        const txnInfo = {
            action: "redeem",
            from: userAddress,
            token: fromToken,
            interactedWith: fromToken,
            amount: amount
        }
        response.status(200).json({ message: "VENUS DEPOSIT SUCCESS", success: true, data: { calldata: encodedCall, to: fromToken, from: userAddress, value: 0 ,txnData: txnInfo} });
    } catch (e) {
        response.status(400).json({ message: "VENUS DEPOSIT FAILED", success: false, data: {} });
        console.log(e);
    }
}

export const getSwapEnsoCalldata = async (request: Request, response: Response) => {
    try {
        const { userAddress, chainId,fromTokenSymbol, toTokenSymbol, amount, slippage } = request.body;
        let registry:any = TOKEN_REGISTRY;
        let protocolRegistry: any = PROTOCOL_ADDRESS_REGISTRY;
        let tokenA;
        let tokenB;
        if(ethers.isAddress(fromTokenSymbol)){
            tokenA = fromTokenSymbol;
        }else{
            tokenA = registry[chainId][fromTokenSymbol];
        }

        if(ethers.isAddress(toTokenSymbol)){
            tokenB = toTokenSymbol;
        }else{
            tokenB = registry[chainId][toTokenSymbol];
        }

        const params = {
            fromAddress: userAddress,
            spender: userAddress,
            receiver: userAddress,
            tokenIn: tokenA,
            amountIn: amount.toString(),
            tokenOut: tokenB,
            routingStrategy: "router",
            chainId: chainId,
            slippage: slippage,
            tokenInAmountToApprove: amount.toString()
        }
        const ensoResponse = await axios.get("https://api.enso.finance/api/v1/shortcuts/route?" + `${qs.stringify(params)}`, {
            headers: { Authorization: `Bearer ${ENV_VARIABLES.ENSO_API_KEY}` }
        })
        console.log(ensoResponse.data.tx);
        const txnInfo = {
            action: "swap",
            from: userAddress,
            token: tokenA,
            interactedWith: ensoResponse.data.tx.to,
            amount: amount
        }
        let callDataArray = [];
        const swapCalldata = { calldata: ensoResponse.data.tx.data, to: ensoResponse.data.tx.to, from: userAddress, value: ensoResponse.data.tx.value ,txnData: txnInfo};
        if(fromTokenSymbol != 'ETH' && fromTokenSymbol != 'BNB'){
            const erc20Interface = new ethers.Interface(ERC20abi);
            const encodedCallApprove = erc20Interface.encodeFunctionData("approve", [swapCalldata.to, amount]);
            console.log(encodedCallApprove);
            const txnInfoApprove = {
                action: "approve",
                from: userAddress,
                token: tokenA,
                interactedWith: tokenA,
                amount: amount
            }
            callDataArray.push({ calldata: encodedCallApprove, to: tokenA, from: userAddress, value: 0 ,txnData: txnInfoApprove})
        }
        callDataArray.push(swapCalldata);
        response.status(200).json({ message: "ENSO SUCCESS", success: true, data: callDataArray});
    } catch (e) {
        response.status(400).json({ message: "ENSO FAILED", success: false, data: {} });
        console.log(e);
    }
}

export const getLifiSwap = async (request: Request, response: Response) => {
    try {
        const { userAddress, fromChain, toChain, fromToken, toToken, amount } = request.body;
        const lifiSwap = await axios.get('https://li.quest/v1/quote', {
            params: {
                fromChain: fromChain,
                toChain: toChain,
                fromToken: fromToken,
                toToken: toToken,
                fromAmount: amount,
                fromAddress: userAddress,
            }
        }
        );
        console.log(lifiSwap.data.transactionRequest);
        const txnInfo = {
            action: "bridge",
            from: userAddress,
            token: fromToken,
            interactedWith: lifiSwap.data.transactionRequest.to,
            amount: amount
        }
        response.status(200).json({ message: "LIFI SUCCESS", success: true, data: { calldata: lifiSwap.data.transactionRequest.data, toAddress: lifiSwap.data.transactionRequest.to, from: userAddress, value: lifiSwap.data.transactionRequest.value ,txnData: txnInfo} });
    } catch (e) {
        response.status(400).json({ message: "LIFI FAILED", success: false, data: {} });
        console.log(e);
    }
}

export const getLimitOrderApi = async (request: Request, response: Response) => {
    try {
        const { userAddress, fromToken, toToken, amount, slippage, price } = request.body;
        const limitOrderInterface = new ethers.Interface(LimitOrderAbi);
        const encodedCall = limitOrderInterface.encodeFunctionData("createOrder", [price,amount,fromToken,toToken,"300",slippage])
        console.log(encodedCall);
        const txnInfo = {
            action: "createOrder",
            from: userAddress,
            token: fromToken,
            interactedWith: "0x2535c8ceFD2dF5B8eED094d439512B8679543b6e",
            amount: amount
        }
        response.status(200).json({ message: "LIMIT_ORDER SUCCESS", success: true, data: { calldata: encodedCall, to: "0x2535c8ceFD2dF5B8eED094d439512B8679543b6e", from: userAddress, value: 0 ,txnData: txnInfo} });
    } catch (e) {
        response.status(400).json({ message: "LIMIT_ORDER FAILED", success: false, data: {} });
        console.log(e);
    }
}

export const getChainlinkCCIPCalldata = async (request: Request, response: Response) => {
    try{
        const { userAddress, tokenSymbol, amount, fromChainId, toChainId } = request.body;

        console.log({ userAddress, tokenSymbol, amount, fromChainId, toChainId })

        const sourceProvider = new ethers.JsonRpcProvider(CHAINLINK_CCIP_REGISTRY[fromChainId].rpc)

        const sourceChainRouter = CHAINLINK_CCIP_REGISTRY[fromChainId].router;
        const destinationChainRouter = CHAINLINK_CCIP_REGISTRY[toChainId].router;

        const sourceChainSelector = CHAINLINK_CCIP_REGISTRY[fromChainId].chainSelector;
        const destinationChainSelector = CHAINLINK_CCIP_REGISTRY[toChainId].chainSelector;

        const sourceRouter = new ethers.Contract(sourceChainRouter,chainlinkCCIPRouterABI,sourceProvider);
        
        const registry:any = TOKEN_REGISTRY;
        const token = registry[fromChainId][tokenSymbol];

        const tokenAmounts = [
            {
              token: token,
              amount: amount,
            },
          ];

        const functionSelector = ethers.id("CCIP EVMExtraArgsV1").slice(0, 10);
        const defaultAbiCoder = ethers.AbiCoder.defaultAbiCoder();
        const extraArgs = defaultAbiCoder.encode(["uint256"], [0]);

        const encodedExtraArgs = functionSelector + extraArgs.slice(2);

        const message = {
            receiver: defaultAbiCoder.encode(["address"], [userAddress]),
            data: "0x", // no data
            tokenAmounts: tokenAmounts,
            feeToken: ethers.ZeroAddress, // If fee token address is provided then fees must be paid in fee token.
            extraArgs: encodedExtraArgs,
          };
          console.log(destinationChainSelector, message);
        const fees = await sourceRouter.getFee(destinationChainSelector, message);

        console.log("CCIP FEES IN NATIVE: ",fees);

        let callDataArray = [];

        //APPROVE TOKEN TO ROUTER
        const erc20Interface = new ethers.Interface(ERC20abi);
        const encodedCallApprove = erc20Interface.encodeFunctionData("approve", [sourceChainRouter, amount]);
        console.log(encodedCallApprove);
        const txnInfoApprove = {
            action: "approve",
            from: userAddress,
            token: token,
            interactedWith: token,
            amount: amount
        }
        callDataArray.push({ calldata: encodedCallApprove, to: token, from: userAddress, value: 0 ,txnData: txnInfoApprove});

        // CALLDATA FOR CCIP ROUTER
        const ccipRouterInterface = new ethers.Interface(chainlinkCCIPRouterABI);
        const encodedCCIPAddress = ccipRouterInterface.encodeFunctionData("ccipSend",[destinationChainSelector,message]);
        const ccipTxnInfo = {
            action: "ccipSend",
            from: userAddress,
            token: token,
            interactedWith: sourceChainRouter,
            amount: amount
        }

        callDataArray.push({ calldata: encodedCCIPAddress, to: sourceChainRouter, from: userAddress, value: fees.toString() ,txnData: ccipTxnInfo});
        
        response.status(200).json({ message: "CHAINLINK_CCIP SUCCESS", success: true, data: callDataArray });
    }catch(e){
        response.status(400).json({ message: "CHAINLINK_CCIP FAILED", success: false, data: {} });
        console.log(e);
    }
}

// export const deployCrossChainTokenL1 = async (request: Request, response: Response) => {
//     try{
//         const { userAddress, tokenSymbol, tokenName, chainId } = request.body;
//         let callDataArray = [];

//         const l1TokenFactoryInterface = new ethers.Interface(l1TokenFactoryABI);
//         const encodedCall = l1TokenFactoryInterface.encodeFunctionData("deployL1Erc20",[tokenName,tokenSymbol]);
//         let protocolRegistry: any = PROTOCOL_ADDRESS_REGISTRY;
//         const factoryAddress = protocolRegistry[chainId].L1TokenFactory;
//         const amount = 0;
//         const txnInfo = {
//             action: "deployL1Erc20",
//             from: userAddress,
//             token: tokenName,
//             interactedWith: factoryAddress,
//             amount: amount
//         }

//         callDataArray.push({ calldata: encodedCall, to: factoryAddress, from: userAddress, value: 0 ,txnData: txnInfo})
//         response.status(200).json({ message: "DEPLOY_L1_TOKEN SUCCESS", success: true, data: callDataArray });
//     }catch(e){
//         response.status(400).json({ message: "DEPLOY_L1_TOKEN FAILED", success: false, data: {} });
//         console.log(e);
//     }
// }

// export const deployCrossChainTokenL2 = async (request: Request, response: Response) => {
//     try{
//         const provider = new ethers.JsonRpcProvider("https://optimism-sepolia.blockpi.network/v1/rpc/public")
//         console.log("HELLO");
//         const privateKey = process.env.PRIVATE_KEY;
//         console.log("HELLO");

//         const wallet = new ethers.Wallet(privateKey.toString(),provider);
//         console.log("HELLO");
//         const contract = new ethers.Contract("0x1c3d038Cc368feA79dd35644e1E8ef9d9235C115",l2TokenFactoryABI,wallet);
//         console.log("HELLO");

//         const { userAddress, tokenSymbol, tokenName, l1TokenAddress } = request.body;

//         const tx = await contract.deployL2Erc20(userAddress,tokenName,tokenSymbol,"0x4200000000000000000000000000000000000010",l1TokenAddress);
//         console.log("HELLO");
//         let result = await tx.wait(5)
//         const emittedLogs = result.logs[0].args
//         console.log("OWNER", emittedLogs[0] );
//         console.log("INDEX", emittedLogs[1] );
//         console.log("L2 TOKEN ADDRESS", emittedLogs[2] );
//         console.log("L1 TOKEN ADDRESS", emittedLogs[3] );

//         const tempData = {
//             "OWNER": emittedLogs[0],
//             "INDEX": emittedLogs[1],
//             "L2 TOKEN ADDRESS": emittedLogs[2],
//             "L1 TOKEN ADDRESS": emittedLogs[3]
//         }

//         // console.log(index,userInfo);

//         await tx.wait(2);

//         response.status(200).json({ message: "DEPLOY_L2_TOKEN SUCCESS", success: true, data: {tempData} });
//     }catch(e){
//         response.status(400).json({ message: "DEPLOY_L2_TOKEN FAILED", success: false, data: {} });
//         console.log(e);
//     }
// }