
import React, { useEffect, useState, } from 'react';
import axios from 'axios';
import { Chart, registerables } from "chart.js";
import { useChatComponentHandler } from '@/context/ChatComponentHandler';
import Table from '../Table/Table';
import TableThead from '../Table/TableThead';
import TableRow from '../Table/TableRow';
import moment from 'moment';
import axiosHelper from '@/data/rest/axios';
import ChatLoader from '../Loading/ChatLoader';

Chart.register(...registerables);

const BASE_PARAMS = {
    provider: 'dextools',
    action: 'TOP_GAINER_TOKENS',
}
const ETHEREUM_TOKEN_SCORE_PARAMS = {
    ...BASE_PARAMS,
    network: 'ether',
};
const POLYGON_ZK_EVM_TOKEN_SCORE_PARAMS = {
    ...BASE_PARAMS,
    network: 'polygonzkevm',
}
const POLYGON_TOKEN_SCORE_PARAMS = {
    ...BASE_PARAMS,
    network: 'polygon',
}
const AVALANACE_TOKEN_SCORE_PARAMS = {
    ...BASE_PARAMS,
    network: 'avalanche',
}
const getParams = async (data) => {
    const network = data?.network?.toLowerCase() || '';
    if (network.includes('eth')) {
        return ETHEREUM_TOKEN_SCORE_PARAMS;
    }
    if (network.includes('zkevm')) {
        return POLYGON_ZK_EVM_TOKEN_SCORE_PARAMS;
    }
    if (network.includes('polygon')) {
        return POLYGON_TOKEN_SCORE_PARAMS;
    }
    if (network.includes('avalanace')) {
        return AVALANACE_TOKEN_SCORE_PARAMS;
    }
    throw new Error('UNSUPPORTED_NETWORK');
}

export const TopGainerTokens = ({ data: action }) => {
    const [gainerTokens, setGainerTokens] = useState([]);
    const [loading, setLoading] = useState(false);

    const [timeFrame, setTimeFrame] = useState("24h");
    const [queryPayload, setQueryPayload] = useState({})

    const getGainerTokensDetails = async () => {
        try {
            setLoading(true);
            const params = await getParams(action);
            let { timePeriod = '24' } = action;
            if (['5m', '1h', '6h', '24h'].includes(timePeriod)) {
                setTimeFrame(timePeriod)
            }
            const payload = { action: params.action, provider: params.provider, query: { network: params.network, period: timePeriod } };
            setQueryPayload(payload)
            const { data } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            setGainerTokens(data?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (action?.type === 'FETCH_TOP_GAINER_TOKENS') {
            getGainerTokensDetails();
        }
    }, [action]);
    // const getLink = (token) => {
    //     return 'https://www.dextools.io/app/en/ether/pair-explorer/0x76860df4f522d29d86d1583caaaa596c60061413?t=1717328904349'// `https://www.dextools.io/app/en/${queryPayload?.query?.network}/pair-explorer/${token?.address}`
    // }
    const getPairInfo = (token) => {
        return (
            <div>
                <span className='fs-4 fw-bold'>{token?.mainToken?.symbol?.toUpperCase()} / </span><span className='fs-4 text-secondary fw-bold'>{token?.sideToken?.symbol?.toUpperCase()}</span>
                {/* <a href={getLink(token)} target='_black' className='px-4'><i className='feather-external-link fs-3'></i></a> */}
            </div>
        )
    }
    const thead = () => {
        const headers = [
            { label: "#" },
            { label: "Name" },
            { label: "Exchange" },
            { label: "Rank" },
            { label: "Price" },
            { label: `Price in ${timeFrame}` },
            { label: `variation in ${timeFrame}` },
            { label: `Block` },
            { label: `Time` },
        ];
        return <TableThead headers={headers} theadClass="px-6 py-2 border" />;
    };
    const tbody = () => {
        return (
            <>
                {(gainerTokens || []).map((_, index) => (
                    <TableRow key={index}>
                        <td className="whitespace-nowrap px-6 py-2">
                            {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {getPairInfo(_)}
                            {/* {_?.mainToken?.name} */}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.exchange?.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.rank}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.price?.toFixed(4)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.[`price${timeFrame}`]?.toFixed(4)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2 text-success">
                            {_?.[`variation${timeFrame}`]?.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.creationBlock}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {moment(_?.creationTime).format('lll')}
                        </td>
                    </TableRow>
                ))}
            </>
        );
    };
    return (
        <div className='card mt-2 bg-dark'>
            {
                loading ?
                    <ChatLoader />
                    :
                    !gainerTokens?.length ?
                        <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                        :
                        <>
                            <div className='card-body text-center h3 pb-2 mb-1 theme-gradient'>Top Gainer Tokens ({queryPayload?.query?.network})</div>
                            <div style={{ maxHeight: '60vh' }} className='table-responsive'>
                                <Table
                                    renderThead={thead()}
                                    renderTbody={tbody()} />
                            </div>
                        </>
            }
        </div>
    );
};