
import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from "chart.js";
import ChatLoader from '@/components/Loading/ChatLoader';
import axiosHelper from '@/data/rest/axios';
Chart.register(...registerables);
const PARAMS = {
    provider: 'blockscout',
    action: 'BLOCKSCOUT_MARKET_CAP_INFORMATION',
};

export default function MarketCap({ data: props }) {
    const [marketCapInfo, setMarketCapInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const chartRef = useRef(null);
    const closingPriceChartRef = useRef(null);
    const getBlockscoutTxn = async () => {
        try {
            setLoading(true);
            const payload = { action: PARAMS.action, provider: PARAMS.provider, query: {} };
            const { data } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            console.log('👉🏻 Line 21 : ', data);
            setMarketCapInfo(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBlockscoutTxn();
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        if (closingPriceChartRef.current) {
            closingPriceChartRef.current.destroy();
        }
        var chartCtx = document?.getElementById(props.id)?.getContext("2d");
        var closingPriceChartCtx = document?.getElementById(`closing_price_${props.id}`)?.getContext("2d");
        const lastSevenDays = marketCapInfo.length > 7 ? marketCapInfo.slice(0, 7) : marketCapInfo;
        console.log('👉🏻 Line 43 : ', marketCapInfo, lastSevenDays);

        const labels = lastSevenDays.map(item => item?.date);
        const marketCapData = lastSevenDays.map(item => item?.market_cap);
        const closingPriceData = lastSevenDays.map(item => item?.closing_price);

        chartRef.current = new Chart(chartCtx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: 'Last seven days',
                    data: marketCapData,
                    fill: true,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.5
                }]
            },
            options: {},
        });

        closingPriceChartRef.current = new Chart(closingPriceChartCtx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: 'Last seven days',
                    data: closingPriceData,
                    fill: true,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.5
                }]
            },
            options: {},
        });
    }, [marketCapInfo])
    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader />
                :
                !marketCapInfo?.length ?
                    <div className=' card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <div className='bg-dark card-body text-center h3 pb-2 mb-1 theme-gradient border border-secondary'>Daily Market Cap Information</div>
                        <div
                            className="p-4 border border-secondary"
                            style={{
                                width: "100%",
                                maxHeight: "45vh",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div className="row align-items-center" style={{ height: "100%", width: "100%" }}>
                                <div className="col-12" style={{ height: "100%", width: "100%" }}>
                                    <canvas id={props.id}></canvas>
                                </div>
                            </div>
                        </div>

                        <div className='bg-dark card-body text-center h3 pb-2 mb-1 mt-4 theme-gradient border border-secondary'>Daily Closing Price Information</div>
                        <div
                            className="p-4 border border-secondary"
                            style={{
                                width: "100%",
                                maxHeight: "45vh",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div className="row align-items-center" style={{ height: "100%", width: "100%" }}>
                                <div className="col-12" style={{ height: "100%", width: "100%" }}>
                                    <canvas id={`closing_price_${props.id}`}></canvas>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}
