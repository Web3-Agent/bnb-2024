import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Chart, registerables } from "chart.js";
import { humanize, titleize } from 'underscore.string';
import ChatLoader from '../Loading/ChatLoader';
Chart.register(...registerables);

export default function StorageUsage({ data: { username } }) {
    const [storageUsage, setStorageUsage] = useState(null);
    const [loading, setLoading] = useState(false);
    const getUserStorageUsage = async () => {
        setLoading(true);
        try {
            const payload = {
                query: {
                    username,
                },
                action: 'FETCH_USER_STORAGE_USAGE_BY_GIVEN_USERNAME'
            }
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/warpcast/`,
                payload
            );
            setStorageUsage(data?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (username) {
            getUserStorageUsage();
        }
    }, [username]);
    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader /> :
                !storageUsage ?
                    <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <StorageUsageCard storageUsage={storageUsage?.usage} />
                    </>
            }
        </div>
    )
}

const StorageUsageCard = ({ storageUsage }) => {
    const allowed = ['casts', 'reactions', 'links', 'verifications', 'username_proofs', 'signers']
    const labels = ['Used', 'Capacity'];
    const getGraphData = (data) => {
        return {
            labels,
            data: [data['used'], data['capacity']]
        }
    }
    return (
        <div className='row g-2'>
            {allowed?.map((alw, index) => (

                <div className="col-md-6 text-center border border-secondary" key={index}>
                    <div className='text-white fs-3 '>{titleize(humanize(alw))}</div>
                    <DoughnutChart id={`new_ref_id_${index}`} title={alw} data={getGraphData(storageUsage[alw])} />
                </div>

            ))
            }
        </div >
    )
}

export const DoughnutChart = ({ data, id }) => {
    const doughnutChartPoolRef = useRef(null);
    useEffect(() => {
        if (doughnutChartPoolRef.current) {
            doughnutChartPoolRef.current.destroy();
        }
        var ctx = document.getElementById(id).getContext("2d");
        doughnutChartPoolRef.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: "Storage Usage",
                        data: data.data,
                        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
                        hoverOffset: 4,
                    },
                ],
            },
        });
    }, [id]);

    return (
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
            <canvas id={id}></canvas>
        </div >
    )
}