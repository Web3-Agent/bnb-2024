import { ENV_VARIABLES } from "../configurations/env";
import { DATA_PROVIDER_MAPPING } from "../constants/dataProvider";
import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
const STANDARD_METHODS = {
    GAS_PRICE_METHOD: 'eth_gasPrice',
    BLOCK_DETAILS_BY_NUMBER_METHOD: 'eth_getBlockByNumber',
    BLOCK_NUMBER_METHOD: 'eth_blockNumber',
    TRANSACTION_DETAILS_BY_HASH_METHOD: 'eth_getTransactionByHash',
    BLOCK_DETAILS_BY_HASH_METHOD: 'eth_getBlockByHash',
}
export const BLOCK_PI_RPC_MAPPING: any = {
    POLYGON: {
        RPC_URL: 'https://polygon.blockpi.network/v1/rpc/BLOCK_PI_POLYGON_RPC_KEY',
        ...STANDARD_METHODS,
    },
    ETHEREUM: {
        RPC_URL: 'https://ethereum.blockpi.network/v1/rpc/BLOCK_PI_ETHEREUM_RPC_KEY',
        ...STANDARD_METHODS,
    },
    KLAYTN: {
        RPC_URL: 'https://klaytn.blockpi.network/v1/rpc/BLOCK_PI_KLAYTN_RPC_KEY',
        GAS_PRICE_METHOD: 'klay_gasPrice',
        BLOCK_DETAILS_BY_NUMBER_METHOD: 'klay_getBlockByNumber',
        BLOCK_NUMBER_METHOD: 'klay_blockNumber',
        TRANSACTION_DETAILS_BY_HASH_METHOD: 'klay_getTransactionByHash',
        BLOCK_DETAILS_BY_HASH_METHOD: 'klay_getBlockByHash',
    },
    BSC: {
        RPC_URL: 'https://bsc.blockpi.network/v1/rpc/BLOCK_PI_BSC_RPC_KEY',
        ...STANDARD_METHODS,
    },
    ARBITRUM: {
        RPC_URL: 'https://arbitrum.blockpi.network/v1/rpc/BLOCK_PI_ARBITRUM_RPC_KEY',
        ...STANDARD_METHODS,
    },
    OPTIMISM: {
        RPC_URL: 'https://optimism.blockpi.network/v1/rpc/BLOCK_PI_OPTIMISM_RPC_KEY',
        ...STANDARD_METHODS,
    },
    SCROLL: {
        RPC_URL: 'https://scroll.blockpi.network/v1/rpc/BLOCK_PI_SCROLL_RPC_KEY',
        ...STANDARD_METHODS,
    },
    GNOSIS: {
        RPC_URL: 'https://gnosis.blockpi.network/v1/rpc/BLOCK_PI_GNOSIS_RPC_KEY',
        ...STANDARD_METHODS,
    },
    AVALANCHE: {
        RPC_URL: 'https://avalanche.blockpi.network/v1/rpc/BLOCK_PI_AVALANCHE_RPC_KEY',
        ...STANDARD_METHODS,
    },
    FANTOM: {
        RPC_URL: 'https://fantom.blockpi.network/v1/rpc/BLOCK_PI_FANTOM_RPC_KEY',
        ...STANDARD_METHODS,
    },
    CRONOS: {
        RPC_URL: 'https://cronos.blockpi.network/v1/rpc/BLOCK_PI_CRONOS_RPC_KEY',
        ...STANDARD_METHODS,
    },
    OASYS: {
        RPC_URL: 'https://oasys.blockpi.network/v1/rpc/BLOCK_PI_OASYS_RPC_KEY',
        ...STANDARD_METHODS,
    },
    METER: {
        RPC_URL: 'https://meter.blockpi.network/v1/rpc/BLOCK_PI_METER_RPC_KEY',
        ...STANDARD_METHODS,
    },
    BASE: {
        RPC_URL: 'https://base.blockpi.network/v1/rpc/BLOCK_PI_BASE_RPC_KEY',
        ...STANDARD_METHODS,
    },
    LINEA: {
        RPC_URL: 'https://linea.blockpi.network/v1/rpc/BLOCK_PI_LINEA_RPC_KEY',
        ...STANDARD_METHODS,
    },
}

export const getNetworkConfiguration = (network: string, provider: string) => {
    if (!network) throw new Error(HTTP_RESPONSE_MESSAGES.NO_NETWORK_FOUND);

    switch (provider) {
        case DATA_PROVIDER_MAPPING.BLOCKPI: {
            network = network.toUpperCase()
            let networkConfig = BLOCK_PI_RPC_MAPPING[network];
            if (!networkConfig) {
                throw new Error(HTTP_RESPONSE_MESSAGES.NO_NETWORK_CONFIG_FOUND);
            }
            const replaceKey = `BLOCK_PI_${network}_RPC_KEY`;
            networkConfig.RPC_URL = networkConfig.RPC_URL.replace(replaceKey, ENV_VARIABLES[replaceKey]);
            return networkConfig;
        }
        default:
            throw new Error(HTTP_RESPONSE_MESSAGES.UNKNOWN_DATA_SOURCE)
    }
}
