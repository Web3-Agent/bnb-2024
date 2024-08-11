import { getNetworkName, getSortKeyForDexInformation } from '@/helper/dexTools';
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import ChatLoader from '../Loading/ChatLoader';
import { BarChart } from '@mui/x-charts/BarChart';
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function DexInformation({ data: props }) {
    console.log('👉🏻 Line 4 : ', props);
    const [dexInformation, setDexInformation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dexSortKey, setDexSortKey] = useState('')
    const chartRef = useRef(null);

    const getDexInformation = async () => {
        try {
            setLoading(true);
            let { network = '', type, sortKey = '' } = props;
            network = await getNetworkName(network);
            sortKey = await getSortKeyForDexInformation(sortKey);
            setDexSortKey(sortKey)
            const queryParam = {
                network,
                sortKey,
            };
            const payload = { action: type, provider: 'dextools', query: queryParam };
            console.log('🚀 ~ getTransactionHashDetails ~ payload:', payload);

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                payload
            );
            console.log('👉🏻 Line 33 : ', data.data.results);

            setDexInformation(data?.data?.results || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getDexInformation();
    }, [props])
    console.log('👉🏻 Line 37 : ', dexInformation)
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        var chartCtx = document?.getElementById(props.id)?.getContext("2d");


        const exchanges = dexInformation?.map(item => item.name);
        const pools = dexInformation?.map(item => item?.pools || 0);
        const volumes = dexInformation?.map(item => item?.volume24h || 0);
        const swaps = dexInformation?.map(item => item?.swaps24h || 0);
        console.log('👉🏻 Line 55 : ', dexInformation);
        console.log('👉🏻 Line 60 : ', exchanges);

        console.log('👉🏻 Line 63 : ', volumes);
        console.log('👉🏻 Line 60 : ', swaps);
        console.log('👉🏻 Line 61 : ', pools);


        let chartData = volumes;
        if (dexSortKey === 'pools') chartData = pools;
        if (dexSortKey === 'swaps24h') chartData = swaps;
        chartRef.current = new Chart(chartCtx, {
            type: "bar",
            data: {
                labels: exchanges,
                datasets: [{
                    label: `Exchange ${dexSortKey}`,
                    data: chartData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)',
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
            },
        });
    }, [dexInformation])
    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader />
                :
                !dexInformation?.length ?
                    <div className=' card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <div className='bg-dark card-body text-center h3 pb-2 mb-1 theme-gradient'>Exchange Information</div>
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
