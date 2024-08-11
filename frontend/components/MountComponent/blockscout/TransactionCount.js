
import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from "chart.js";
import ChatLoader from '@/components/Loading/ChatLoader';
import axiosHelper from '@/data/rest/axios';
Chart.register(...registerables);
const PARAMS = {
    provider: 'blockscout',
    action: 'BLOCKSCOUT_TRANSACTION_INFORMATION',
};

export default function TransactionCount({ data: props }) {
    const [transactionInfo, setTransactionInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const chartRef = useRef(null);

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
            setTransactionInfo(data.data);
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
        var chartCtx = document?.getElementById(props.id)?.getContext("2d");
        const lastSevenDays = transactionInfo.length > 7 ? transactionInfo.slice(0, 7) : transactionInfo;
        const labels = lastSevenDays.map(item => item?.date)
        const data = lastSevenDays.map(item => item?.tx_count)
        chartRef.current = new Chart(chartCtx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: 'Last seven days',
                    data,
                    fill: true,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.5
                }]
            },
            options: {},
        });
    }, [transactionInfo]);

    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader />
                :
                !transactionInfo?.length ?
                    <div className=' card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <div className='bg-dark card-body text-center h3 pb-2 mb-1 theme-gradient'>Daily Transaction Count Information</div>
                        <div
                            className="p-4"
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
                    </>
            }
        </div>
    )
}
