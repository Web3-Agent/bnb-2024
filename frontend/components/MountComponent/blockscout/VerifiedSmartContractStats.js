import ChatLoader from '@/components/Loading/ChatLoader';
import axiosHelper from '@/data/rest/axios';
import React, { useState, useEffect } from 'react'
const PARAMS = {
    provider: 'blockscout',
    action: 'VERIFIED_SMART_CONTRACTS_COUNTERS',
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
import { RiContractLine } from "react-icons/ri";
import { LiaFileContractSolid } from "react-icons/lia";

export default function VerifiedSmartContractStats() {
    const [verifiedSmartContractStats, setVerifiedSmartContractStats] = useState({});
    const [loading, setLoading] = useState(false);

    const getVerifiedSmartContractStats = async () => {
        try {
            setLoading(true);
            const payload = { action: PARAMS.action, provider: PARAMS.provider, query: {} };
            const { data } = await axiosHelper(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/data-api/`,
                'POST',
                null,
                payload
            );
            console.log('👉🏻 Line 33 : ', data);

            setVerifiedSmartContractStats(data?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getVerifiedSmartContractStats();
    }, []);
    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader />
                :
                !(Object.keys(verifiedSmartContractStats))?.length ?
                    <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <div className='bg-dark card-body text-center h3 pb-2 mb-1 theme-gradient border border-secondary'>Verified Smart Contracts Counters</div>
                        <div className='row'>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Smart Contracts"} value={formatNumber(verifiedSmartContractStats?.smart_contracts) || '-'} Icon={<LiaFileContractSolid size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Verified Smart Contracts"} value={formatNumber(verifiedSmartContractStats?.verified_smart_contracts) || '-'} Icon={<LiaFileContractSolid size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"New Contracts (24h)"} value={formatNumber(verifiedSmartContractStats?.new_smart_contracts_24h) || '-'} Icon={<RiContractLine size={36} color='white' />} />
                            </div>
                            <div className='col-md-6 col-sm-12 pt-2' style={{ height: '80px' }}>
                                <StatsCard title={"Verified New Contracts (24h)"} value={formatNumber(verifiedSmartContractStats?.new_verified_smart_contracts_24h) || '-'} Icon={<RiContractLine size={36} color='white' />} />
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
export function formatNumber(num = 0) {
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