const solc = require("solc");
import { Response } from "express";
import { polygonMumbai } from "viem/chains";
import { createViemChain } from "../helpers/contract";
import handleImports from "../helpers/handleImports";
import { DeployContractConfig, DeployContractResponse } from "../types/contract";
import { CustomRequest } from "../types/customRequest";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";

export const compileContract = async (request: CustomRequest, response: Response) => {
    try {
        const { contractName, constructorArgs = [], sourceCode, chainName } = request.body;
        const compiledContract = await deployContractCompile({ sourceCode, constructorArgs, chainName, contractName });
        response.status(200).json({ message: HTTP_RESPONSE_MESSAGES.CONTRACT_COMPILE_SUCCESS, success: true, data: compiledContract })
    } catch (error) {
        console.log('👉🏻 Line 16 : ', error);

        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.CONTRACT_COMPILE_FAILED, success: false })
    }
}

async function deployContractCompile({
    sourceCode,
    constructorArgs,
    chainName = 'Goerli',
    contractName = 'MySmartContract',
}: DeployContractConfig): Promise<DeployContractResponse> {
    const viemChain = createViemChain(chainName) || polygonMumbai
    const fileName = contractName.replace(/[\/\\:*?"<>|.\s]+$/g, '_') + '.sol'

    // Prepare the sources object for the Solidity compiler
    const handleImportsResult = await handleImports(sourceCode)

    const sources = {
        [fileName]: {
            content: handleImportsResult?.sourceCode
        },
        ...handleImportsResult?.sources
    }
    // loop through sources and log the keys
    const sourcesKeys = Object.keys(sources)

    // Loop over each source
    for (const sourceKey of sourcesKeys) {
        let sourceCode = sources[sourceKey].content

        // Find all import statements in the source code
        const importStatements = sourceCode.match(/import\s+["'][^"']+["'];/g) || []

        // Loop over each import statement
        for (const importStatement of importStatements) {
            // Extract the file name from the import statement
            const importPathMatch = importStatement.match(/["']([^"']+)["']/)

            // If no import path is found, continue to the next statement
            if (!importPathMatch) continue

            // Extract the file name from the path
            const importPath = importPathMatch[1]
            const fileName = importPath.split('/').pop() || importPath

            // Replace the import statement with the new import statement
            sourceCode = sourceCode.replace(importStatement, `import "${fileName}";`)
        }

        // Update the source content in your sources object
        sources[sourceKey].content = sourceCode
    }

    // Compile the contract
    const standardJsonInput = JSON.stringify({
        language: 'Solidity',
        sources,
        settings: {
            evmVersion: 'london',
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    })

    const output = JSON.parse(solc.compile(standardJsonInput))
    if (output.errors) {
        // Filter out warnings
        const errors = output.errors.filter(
            (error: { severity: string }) => error.severity === 'error'
        )
        if (errors.length > 0) {
            const error = new Error(errors[0].formattedMessage)
            throw error
        }
    }
    const contract = output.contracts[fileName]
    // Get the contract ABI and bytecode
    // TODO: make dynamic 
    const contractKey = Object.keys(contract)[0]
    const abi = contract[contractKey].abi
    let bytecode = contract[contractKey].evm.bytecode.object
    if (!bytecode.startsWith('0x')) {
        bytecode = '0x' + bytecode
    }

    const compiledContract = {
        abi: abi,
        bytecode: bytecode,
        args: constructorArgs || []
    }

    return compiledContract
};

export default { compileContract }