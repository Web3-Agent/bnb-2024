import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { humanize, titleize } from 'underscore.string';
import moment from 'moment';
import ChatLoader from '../Loading/ChatLoader';

export default function StorageAllocation({ data: { username } }) {
    const [allocation, setAllocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const getUserStorageAllocation = async () => {
        setLoading(true);
        try {
            const payload = {
                query: {
                    username,
                },
                action: 'FETCH_USER_STORAGE_ALLOCATION_BY_GIVEN_USERNAME'
            }
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/warpcast/`,
                payload
            );
            setAllocation(data?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (username) {
            getUserStorageAllocation();
        }
    }, [username]);
    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader /> :
                !allocation ?
                    <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <UserAllocationCard data={allocation.allocations} />
                    </>

            }

        </div>
    )
}

const UserAllocationCard = ({ data }) => {
    return (
        <div className='row g-2 text-white p-4'>
            {(data || [])?.map((all, index) => (
                <div className="col" key={index}>
                    <div>Allocation: {titleize(humanize(all.object))}</div>
                    <div>Expiry: {moment(all?.expiry).format("MMM Do YY")}</div>
                    <div>Units: {all?.units}</div>
                </div>
            ))
            }

        </div >
    )
}