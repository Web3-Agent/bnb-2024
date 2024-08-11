export interface DeployContractConfig {
    chainName: string;
    contractName: string;
    sourceCode: string;
    constructorArgs: Array<string | string[]>;
}

export interface DeployContractResponse {
    abi: string;
    bytecode: string;
    args: Array<string | string[]>;
}


export type ChainData = {
    name: string;
    chain: string;
    icon?: string;
    rpc: string[];
    features?: { name: string }[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    slip44?: number;
    ens?: {
        registry: string;
    };
    explorers?: {
        name: string;
        url: string;
        standard?: string;
        icon?: string;
    }[];
};