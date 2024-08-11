import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from "chart.js";
import Table from '../Table/Table';
import TableThead from '../Table/TableThead';
import TableRow from '../Table/TableRow';
import Pagination from '../ui/Pagination';
import axiosHelper from '@/data/rest/axios';
import ChatLoader from '../Loading/ChatLoader';

Chart.register(...registerables);
const TOKEN_SCORE_PARAMS = {
    provider: 'dextools',
    action: 'BLOCKCHAIN_LIST',
};

export const BlockchainListComponent = ({ data: action }) => {
    const [blockchains, setBlockchains] = useState([]);
    const [pagination, setPagination] = useState({
        page: 0, pageSize: 50, totalPages: 1
    })
    const [loading, setLoading] = useState(false);

    const getBlockchainDetails = async () => {
        try {
            setLoading(true);
            const payload = { action: TOKEN_SCORE_PARAMS.action, provider: TOKEN_SCORE_PARAMS.provider, query: { page: pagination.page, pageSize: pagination.pageSize } };
            const { data } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            setPagination({
                page: data.data?.page, pageSize: data.data?.pageSize, totalPages: data.data?.totalPages
            })
            setBlockchains(data.data?.results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBlockchainDetails();
    }, [action]);
    useEffect(() => {
        getBlockchainDetails();
    }, []);
    const refetchWithUpdates = async (value) => {
        setPagination((prev) => ({ ...prev, page: value }))
        await getBlockchainDetails();
    }

    const thead = () => {
        const headers = [
            { label: "#" },
            { label: "Name" },
            { label: "Visit" },
        ];
        return <TableThead headers={headers} theadClass="px-6 py-2" />;
    };
    const tbody = () => {
        return (
            <>
                {(blockchains || []).map((_, index) => (
                    <TableRow>
                        <td className="whitespace-nowrap px-6 py-2">
                            {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            <a href={_?.website} target='_black'><i className='feather-external-link fs-3'></i></a>
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
                    !blockchains?.length ?
                        <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                        :
                        <>
                            <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>Blockchain List</div>
                            <div style={{ height: '60vh' }} className='table-responsive'>
                                <Table
                                    renderThead={thead()}
                                    renderTbody={tbody()} />
                            </div>
                            <Pagination pagination={pagination} setPagination={setPagination} onClick={() => { refetchWithUpdates() }} />
                        </>
            }
        </div>
    );
};