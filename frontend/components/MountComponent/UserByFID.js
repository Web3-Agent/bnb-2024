import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ChatLoader from '../Loading/ChatLoader';

export default function UserByFID({ data: { fid } }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const getUserByFID = async () => {
        setLoading(true);
        try {
            const payload = {
                query: {
                    fids: fid,
                },
                action: 'FETCH_USER_DETAILS_BY_GIVEN_FID'
            }
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/warpcast/`,
                payload
            );
            setUser(data?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (fid) {
            getUserByFID();
        }
    }, [fid]);
    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader /> :
                !user ?
                    <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <UserCard user={user} />
                    </>
            }
        </div>
    )
}
function truncateString(str, maxLength = 60) {
    if (str.length <= maxLength) {
        return str;
    }
    return str.slice(0, maxLength) + '...';
}
const UserCard = ({ user }) => {
    return (

        <>
            <div className='fs-2 text-white px-4'>Here is user details</div>
            <div className='row'>
                <div className="col-12">
                    <div className="card profile-card">
                        <img src={user?.pfp_url} className="card-img-top profile-image" alt="User Image" />
                        <div className="card-body">
                            <h5 className="card-title text-muted px-2">@{user?.username || 'NA'} ({user?.fid})</h5>
                            <p className="card-text fs-5 text-black px-2">Bio: {truncateString(user?.profile?.bio?.text) || 'NA'}</p>
                            <div className='row px-2 pt-2'>
                                <div className='col-6 rounded text-center fs-5'>

                                    <button style={{ background: "#82f5c9" }} class="btn col-12 mt-2" type="button"> followers: {user?.follower_count || 'NA'}</button>

                                </div>
                                <div className='col-6 rounded text-center fs-5'>

                                    <button style={{ background: "#f582d2" }} class="btn col-12 mt-2" type="button">following:  {user?.following_count || 'NA'}</button>

                                </div>
                                <div className='col-12 rounded text-center fs-5'>

                                    <a class="btn btn-primary col-12 mt-2" href={`https://warpcast.com/${user?.username}`} target='blank'>Visit Profile</a>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div></>
    )
}