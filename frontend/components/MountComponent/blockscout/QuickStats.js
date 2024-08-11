import ChatLoader from '@/components/Loading/ChatLoader';
import axiosHelper from '@/data/rest/axios';
import React, { useState, useEffect } from 'react'
const PARAMS = {
    provider: 'blockscout',
    action: 'BLOCKSCOUT_STATS',
};
import moment from 'moment';
import { PiCubeFocus } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";
import { IoWalletOutline } from "react-icons/io5";
import { GiNetworkBars } from "react-icons/gi";
import { FaGasPump } from "react-icons/fa6";
import { BsCoin } from "react-icons/bs";
import { PiHandCoinsFill } from "react-icons/pi";
import { SiMarketo } from "react-icons/si";
import { LuCalendarClock } from "react-icons/lu";

export default function QuickStats() {
    const [quickStats, setQuickStats] = useState({});
    const [loading, setLoading] = useState(false);

    const getBlockscoutStats = async () => {
        try {
            setLoading(true);
            const payload = { action: PARAMS.action, provider: PARAMS.provider, query: {} };
            const { data: { data } } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            setQuickStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBlockscoutStats();
    }, []);
    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader />
                :
                !(Object.keys(quickStats))?.length ?
                    <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <div className='bg-dark card-body text-center h3 pb-2 mb-1 theme-gradient border border-secondary'>Quick Stats</div>
                        <div className='row'>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Coin Price"} value={'$' + (quickStats?.coin_price) || '-'} Icon={<BsCoin size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Coin Price Change (%)"} valueColor={quickStats?.coin_price_change_percentage > 0 ? 'text-success' : 'text-danger'} value={formatNumber(quickStats?.coin_price_change_percentage) + '%' || '-'} Icon={<PiHandCoinsFill size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Market Cap"} value={formatNumber(quickStats?.market_cap) || '-'} Icon={<SiMarketo size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Avg. Block Time"} value={(quickStats?.average_block_time / 1000).toFixed(1) + 's' || '-'} Icon={<PiCubeFocus size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Total Blocks"} value={formatNumber(quickStats?.total_blocks) || '-'} Icon={<PiCubeFocus size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Total Transactions"} value={formatNumber(quickStats?.total_transactions) || '-'} Icon={<GrTransaction size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Transactions Today"} value={formatNumber(quickStats?.transactions_today) || '-'} Icon={<GrTransaction size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Wallet Address"} value={formatNumber(quickStats?.total_addresses) || '-'} Icon={<IoWalletOutline size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Network Utilization (%)"} value={quickStats?.network_utilization_percentage.toFixed(2) + '%' || '-'} Icon={<GiNetworkBars size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Gas Price (slow)"} valueColor={"text-danger"} value={(quickStats?.gas_prices?.slow) || '-'} Icon={<FaGasPump size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Gas Price (average)"} valueColor={"text-warning"} value={(quickStats?.gas_prices?.average) || '-'} Icon={<FaGasPump size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Gas Price (fast)"} value={(quickStats?.gas_prices?.fast) || '-'} Icon={<FaGasPump size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Gas Price (updated)"} value={(moment(quickStats?.gas_price_updated_at).format('lll')) || '-'} Icon={<LuCalendarClock size={36} color='white' />} />
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

const StatsCard = ({ title, value, Icon, valueColor = 'text-success' }) => {
    return (
        <div className='border border-grey-light p-2' style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '2rem', width: '100%' }}>
            <div className='text-center bg-secondary rounded p-2'>
                {Icon}
            </div>
            <div>
                <div className='text-secondary fs-5 fw-medium'>{title}</div>
                <div className={`${valueColor} fs-3 fw-bold`}>{value}</div>
            </div>
        </div>
    )
}
export function formatNumber(num) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        return num.toString();
    }
}