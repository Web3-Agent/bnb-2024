

import { Chain } from "viem";
import { distance } from "fastest-levenshtein";
import { opBNBTestnet } from "viem/chains";
import { CHAINS } from "../constants/chains";
import { ChainData } from "../types/contract";
import { ENV_VARIABLES } from "../configurations/env";

export const API_URLS: Record<Chain["name"], string> = {
    'Ethereum': 'https://api.etherscan.io',
    'Goerli': 'https://api-goerli.etherscan.io',
    'Sepolia': 'https://api-sepolia.etherscan.io',
    'Arbitrum One': 'https://api.arbiscan.io',
    'Arbitrum Goerli': 'https://api-goerli.arbiscan.io',
    'Polygon Mainnet': 'https://api.polygonscan.com',
    'Mumbai': 'https://api-testnet.polygonscan.com',
    'Optimism': 'https://api-optimistic.etherscan.io',
    'Optimism Goerli Testnet': 'https://api-goerli.optimistic.etherscan.io',
}

export const API_KEYS: Record<Chain["name"], string | undefined> = {
    'Ethereum': ENV_VARIABLES.ETHEREUM_EXPLORER_API_KEY,
    'Goerli': ENV_VARIABLES.ETHEREUM_EXPLORER_API_KEY,
    'Sepolia': ENV_VARIABLES.ETHEREUM_EXPLORER_API_KEY,
    'Arbitrum One': ENV_VARIABLES.ARBITRUM_EXPLORER_API_KEY,
    'Arbitrum Goerli': ENV_VARIABLES.ARBITRUM_EXPLORER_API_KEY,
    'Polygon Mainnet': ENV_VARIABLES.POLYGON_EXPLORER_API_KEY,
    'Mumbai': ENV_VARIABLES.POLYGON_EXPLORER_API_KEY,
    'Optimism': ENV_VARIABLES.OPTIMISM_EXPLORER_API_KEY,
    'Optimism Goerli Testnet': ENV_VARIABLES.OPTIMISM_EXPLORER_API_KEY,
}

export const createViemChain = (chain: string): Chain | undefined => {
    if (!chain) {
        return opBNBTestnet;
    }
    let chainMatch = CHAINS.find((item: ChainData) => item.name.toLowerCase() === chain.toLowerCase());

    if (!chainMatch) {
        let minDistance = Infinity;
        let bestMatch;

        CHAINS.forEach((chainItem: ChainData) => {
            const formattedChain = chainItem.name.toLowerCase().replace(/[-_]/g, "");
            const formattedInput = chain.toLowerCase().replace(/[-_]/g, "");
            const dist = distance(formattedInput, formattedChain);

            if (dist < minDistance) {
                minDistance = dist;
                bestMatch = chainItem;
            }
        });

        chainMatch = bestMatch;
    }

    if (!chainMatch) {
        return undefined;
    }

    const viemChain: Chain | undefined | any = {
        id: chainMatch.chainId,
        name: chainMatch.name,
        network: chainMatch.name.toLowerCase(),
        nativeCurrency: {
            name: chainMatch.nativeCurrency.name,
            symbol: chainMatch.nativeCurrency.symbol,
            decimals: chainMatch.nativeCurrency.decimals,
        },
        rpcUrls: {
            public: { http: chainMatch.rpc },
            default: { http: chainMatch.rpc },
        },
        blockExplorers: chainMatch.explorers && {
            etherscan: {
                name: chainMatch.explorers[0].name,
                url: chainMatch.explorers[0].url,
            },
            default: {
                name: chainMatch.explorers[0].name,
                url: chainMatch.explorers[0].url,
            },
        },
    };

    return viemChain;
};

export const getRpcUrl = (viemChain: Chain): string | undefined => {
    const rpcUrl: string = viemChain?.rpcUrls.default.http[0]?.replace(
        "${INFURA_API_KEY}",
        ENV_VARIABLES.INFURA_API_KEY || ""
    );
    return rpcUrl;
}

export const getExplorerUrl = (viemChain: Chain): string | undefined => {
    return viemChain?.blockExplorers?.default.url;
}