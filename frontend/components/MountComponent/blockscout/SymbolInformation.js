import axiosHelper from '@/data/rest/axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'

import Table from '../../Table/Table';
import TableThead from '../../Table/TableThead';
import TableRow from '../../Table/TableRow';
import ChatLoader from '../../Loading/ChatLoader';
import { formatNumber } from './QuickStats';
const PARAMS = {
    provider: 'blockscout',
    action: 'BLOCKSCOUT_SYMBOL_INFORMATION',
};
export default function SymbolInformation({ data: { symbol = 'USDT' } }) {
    console.log('👉🏻 Line 4 : ', symbol);
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const getTokenDetailsUsingSymbol = async () => {
        try {
            setLoading(true);
            const payload = { action: PARAMS.action, provider: PARAMS.provider, query: { search: symbol } };

            const { data } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            console.log('👉🏻 Line 22 : ', data);
            setTokens(data?.data)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getTokenDetailsUsingSymbol();
    }, [symbol]);

    const thead = () => {
        const headers = [
            { label: "#" },
            { label: "Name" },
            { label: "Logo" },
            { label: "Symbol" },
            { label: "Token Type" },
            { label: "Supply" },
            { label: `Exchange Rate` },
            { label: `Market Cap` },
            { label: `Address` },
        ];
        return <TableThead headers={headers} theadClass="px-6 py-2 border" />;
    };
    const tbody = () => {
        return (
            <>
                {(tokens || []).map((_, index) => (
                    <TableRow key={index}>
                        <td className="whitespace-nowrap px-6 py-2">
                            {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.name || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.icon_url ?
                                <img src={_?.icon_url} alt={_?.name} style={{ width: '24px', height: '24px' }} /> :
                                '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.symbol || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.token_type || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.total_supply || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.exchange_rate || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.circulating_market_cap || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.address || '-'}
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
                !tokens?.length ?
                    <div className=' card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <div className='bg-dark card-body text-center h3 pb-2 mb-1 theme-gradient'>Tokens: searched by {symbol}</div>
                        <div style={{ maxHeight: '60vh' }} className='table-responsive'>
                            <Table
                                renderThead={thead()}
                                renderTbody={tbody()} />
                        </div>
                    </>
            }
        </div>
    )
}
