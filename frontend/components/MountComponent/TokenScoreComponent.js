import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from "chart.js";
import axiosHelper from '@/data/rest/axios';
import ChatLoader from '../Loading/ChatLoader';

Chart.register(...registerables);
const BASE_PARAMS = {
    provider: 'dextools',
    action: 'TOKEN_SCORE',
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

const getTokenScoreParams = async (data) => {
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
export const TokenScoreComponent = ({ data: action }) => {
    const [tokenScoreDetails, setTokenScoreDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const doughnutChartRef = useRef(null);
    const barChartRef = useRef(null);
    const getTokenScoreDetails = async () => {
        try {
            setLoading(true);
            const {
                provider,
                network,
                action: methodAction,
            } = await getTokenScoreParams(action);
            const payload = { action: methodAction, provider, query: { network, token: action?.token } };
            const { data } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            setTokenScoreDetails(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTokenScoreDetails();
    }, [action]);


    useEffect(() => {
        if (doughnutChartRef.current) {
            doughnutChartRef.current.destroy();
        }
        if (barChartRef.current) {
            barChartRef.current.destroy();
        }
        var ctx = document?.getElementById('doughnutChart')?.getContext('2d');
        const { votes, dextScore } = tokenScoreDetails;
        doughnutChartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    'Down Votes',
                    'Up Votes',
                ],
                datasets: [{
                    label: 'Token Votes',
                    data: [votes?.downvotes, votes?.upvotes],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 4
                }]
            }
        });

        var barCtx = document?.getElementById('barChart')?.getContext('2d');
        barChartRef.current = new Chart(barCtx, {
            type: 'bar',
            yAxis: {
                interval: 10
            },
            data: {
                labels: [
                    'Dex Score'
                ],
                datasets: [{
                    label: 'Total',
                    data: [dextScore?.total],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.8)',
                    ],
                    borderColor: [
                        'rgb(75, 192, 192)',
                    ],
                    borderWidth: 1,
                    hoverOffset: 4
                }]
            },
            options: {},
        });
    }, [tokenScoreDetails]);

    return (
        <div className='card mt-2 bg-dark'>
            {loading
                ? <ChatLoader />
                : Object.keys(tokenScoreDetails).length ?
                    <>
                        <div className='card-body text-center h3 pb-0 mb-0'>Token Score</div><div className='p-4' style={{ width: '100%', height: '45vh', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            <div className='row align-items-center' style={{ height: '100%' }}>
                                <div className='col-6' style={{ height: '100%' }}>
                                    <canvas id='doughnutChart'></canvas>
                                </div>
                                <div className='col-6'>
                                    <canvas id='barChart' style={{ height: '100%' }}></canvas>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
            }

        </div>
    );
};