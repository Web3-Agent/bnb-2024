import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosHelper from '@/data/rest/axios';
import ChatLoader from '../Loading/ChatLoader';

const ETHEREUM_TRANSACTION_HASH_QUERY_PARAMS = {
    provider: 'covalent',
    network: 'eth-mainnet',
    action: 'TRANSACTION_DETAILS_BY_HASH',
};
const BSC_TRANSACTION_HASH_QUERY_PARAMS = {
    provider: 'covalent',
    network: 'bsc-mainnet',
    action: 'TRANSACTION_DETAILS_BY_HASH',
};
const AVALANCHE_TRANSACTION_HASH_QUERY_PARAMS = {
    provider: 'covalent',
    network: 'avalanche-mainnet',
    action: 'TRANSACTION_DETAILS_BY_HASH',
};
const POLYGON_TRANSACTION_HASH_QUERY_PARAMS = {
    provider: 'covalent',
    network: 'matic-mainnet',
    action: 'TRANSACTION_DETAILS_BY_HASH',
};

const getTxHasName = async (data) => {
    const network = data?.network?.toLowerCase();
    if (network.includes('eth')) {
        return ETHEREUM_TRANSACTION_HASH_QUERY_PARAMS;
    }
    if (network.includes('bsc')) {
        return BSC_TRANSACTION_HASH_QUERY_PARAMS;
    }
    if (network.includes('avalanche')) {
        return AVALANCHE_TRANSACTION_HASH_QUERY_PARAMS;
    }
    if (network.includes('polygon')) {
        return POLYGON_TRANSACTION_HASH_QUERY_PARAMS;
    }
    throw new Error('UNSUPPORTED_NETWORK');
};
export const TransactionComponent = ({ data: action }) => {
    const [transactionHashDetails, setTransactionHashDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const getTransactionHashDetails = async () => {
        try {
            setLoading(true);
            const {
                provider,
                network,
                action: methodAction,
            } = await getTxHasName(action);
            const queryParam = {
                network: network,
                hash: action?.txnHash,
            };
            const payload = { action: methodAction, provider, query: queryParam };
            console.log('🚀 ~ getTransactionHashDetails ~ payload:', payload);

            const { data } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            console.log('👉🏻 Line 23 : ', data);
            setTransactionHashDetails(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        getTransactionHashDetails();
    }, [action]);

    return (
        <div
            key={'gas-price'}
            className='card mt-2 bg-dark'
        >
            {
                loading
                    ?
                    <ChatLoader />
                    :
                    Object.keys(transactionHashDetails).length ?
                        <div className='chat-content p-4'>
                            <h6 className='mb--10'>Here is Transaction Hash Details:</h6>
                            <p>Block Hash: {transactionHashDetails?.block_hash}</p>
                            <p>Block Height: {transactionHashDetails?.block_height}</p>
                            <p>From Address: {transactionHashDetails?.from_address}</p>
                            <p>Gas Spent: {transactionHashDetails?.gas_spent}</p>
                            <p>Hash: {transactionHashDetails?.hash}</p>
                            <p>To Address: {transactionHashDetails?.to_address}</p>
                            <p>Network: {transactionHashDetails?.network}</p>
                            <p>Value: {transactionHashDetails?.value}</p>
                            <p>Value in Ether: {transactionHashDetails?.value_in_ether}</p>
                        </div>
                        :
                        <div className='card-body text-center h3 mb-0 theme-gradient'>No Data Found</div>
            }
        </div>

    );
};