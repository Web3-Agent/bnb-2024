

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import Table from '../Table/Table';
import TableThead from '../Table/TableThead';
import TableRow from '../Table/TableRow';
import moment from 'moment';
import axiosHelper from '@/data/rest/axios';
import ChatLoader from '../Loading/ChatLoader';

export const TopTokenListComponent = () => {
    const [tokenListDetails, setTokenListDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const getTokenListDetails = async () => {
        try {
            setLoading(true);
            const queryParam = {
                limit: 10,
            };
            const payload = {
                action: 'LATEST_TOKEN_LIST',
                provider: 'coinmarketcap',
                query: queryParam,
            };

            const { data: { data } } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            setTokenListDetails(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getTokenListDetails();
    }, []);

    const thead = () => {
        const headers = [
            { label: "#" },
            { label: "Name" },
            { label: "Symbol" },
            { label: "Max Supply" },
            { label: "Total Supply" },
            { label: 'Price' },
            { label: 'Market Cap' },
            { label: `Change in 24H` },
        ];
        return <TableThead headers={headers} theadClass="px-6 py-2 border" />;
    };
    const tbody = () => {
        return (
            <>
                {(tokenListDetails || []).map((_, index) => (
                    <TableRow key={index}>
                        <td className="whitespace-nowrap px-6 py-2">
                            {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.symbol}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.max_supply}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.total_supply}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.quote?.USD?.price}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.quote?.USD?.market_cap}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.quote?.USD?.percent_change_24h}
                        </td>
                    </TableRow>
                ))}
            </>
        );
    };
    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader />
                :
                !tokenListDetails?.length ?
                    <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <div className='card-body text-center h3 pb-2 mb-1 theme-gradient'>Top Tokens</div>
                        <div style={{ maxHeight: '60vh' }} className='table-responsive'>
                            <Table
                                renderThead={thead()}
                                renderTbody={tbody()}
                            />
                        </div>
                    </>
            }
        </div>
    );
};
