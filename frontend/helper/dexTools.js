export const getNetworkName = async (network = '') => {
    if (network.includes('eth')) {
        return 'ether';
    }
    if (network.includes('zkevm')) {
        return 'polygonzkevm';
    }
    if (network.includes('poly')) {
        return 'polygon';
    }
    if (network.includes('avalanche')) {
        return 'avalanche';
    }
    if (network.includes('bsc')) {
        return 'bsc';
    }
    throw new Error('UNSUPPORTED_NETWORK');
}

export const getSortKeyForDexInformation = async (sortKey = '') => {
    if (sortKey.includes('pool')) {
        return 'pools';
    }
    if (sortKey.includes('vol')) {
        return 'volume24h';
    }
    if (sortKey.includes('swap')) {
        return 'swaps24h';
    }
    return 'name';
}

export default { getNetworkName, getSortKeyForDexInformation }