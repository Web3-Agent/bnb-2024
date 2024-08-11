import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosHelper from '@/data/rest/axios';
import ChatLoader from '../Loading/ChatLoader';

const ETHEREUM_BLOCK_DETAILS_BY_BLOCK_NUMBER = {
    provider: 'covalent',
    network: 'eth-mainnet',
    action: 'BLOCK_DETAILS_BY_BLOCK_NUMBER',
};
const BSC_BLOCK_DETAILS_BY_BLOCK_NUMBER = {
    provider: 'covalent',
    network: 'bsc-mainnet',
    action: 'BLOCK_DETAILS_BY_BLOCK_NUMBER',
};
const AVALANCHE_BLOCK_DETAILS_BY_BLOCK_NUMBER = {
    provider: 'covalent',
    network: 'avalanche-mainnet',
    action: 'BLOCK_DETAILS_BY_BLOCK_NUMBER',
};
const POLYGON_BLOCK_DETAILS_BY_BLOCK_NUMBER = {
    provider: 'covalent',
    network: 'matic-mainnet',
    action: 'BLOCK_DETAILS_BY_BLOCK_NUMBER',
};

const getBlockName = async (data) => {
    const network = data?.network?.toLowerCase();
    if (network.includes('eth')) {
        return ETHEREUM_BLOCK_DETAILS_BY_BLOCK_NUMBER;
    }
    if (network.includes('bsc')) {
        return BSC_BLOCK_DETAILS_BY_BLOCK_NUMBER;
    }
    if (network.includes('avalanche')) {
        return AVALANCHE_BLOCK_DETAILS_BY_BLOCK_NUMBER;
    }
    if (network.includes('polygon')) {
        return POLYGON_BLOCK_DETAILS_BY_BLOCK_NUMBER;
    }
    throw new Error('UNSUPPORTED_NETWORK');
};

export const BlockDetailsComponent = ({ data: action }) => {
    const [blockHashDetails, setBlockHashDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const getBlockDetails = async () => {
        try {
            setLoading(true);
            const {
                provider,
                network,
                action: methodAction,
            } = await getBlockName(action);
            const queryParam = {
                network: network,
                blockNumber: action?.blockNumber,
            };
            const payload = { action: methodAction, provider, query: queryParam };
            console.log('🚀 ~ getTransactionHashDetails ~ payload:', payload);

            const { data } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            setBlockHashDetails(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getBlockDetails();
    }, [action]);

    return (
        <div
            key={'gas-price'}
            className='card mt-2 bg-dark'
        >
            {loading
                ?
                <ChatLoader />
                :
                Object.keys(blockHashDetails).length ?
                    <div className='chat-content p-4'>
                        <h6 className='mb--10'>Here is Block Details:</h6>
                        <p>Block Hash: {blockHashDetails?.block_hash}</p>
                        <p>Signed At: {blockHashDetails?.signed_at}</p>
                        <p>Height: {blockHashDetails?.height}</p>
                        <p>Block Parent Hash: {blockHashDetails?.block_parent_hash}</p>
                        <p>Miner Address: {blockHashDetails?.miner_address}</p>
                        <p>Gas Used: {blockHashDetails?.gas_used}</p>
                        <p>Gas Limit: {blockHashDetails?.gas_limit}</p>
                        <p>Network: {blockHashDetails?.network}</p>
                        <p>Block Number: {blockHashDetails?.block_number}</p>
                    </div>
                    :
                    <div className='card-body text-center h3 mb-0 theme-gradient'>No Data Found</div>
            }
        </div>
    );
};