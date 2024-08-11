import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import ChatLoader from '../Loading/ChatLoader';

export default function UsersByUsername({ data: { username } }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const getUsersByUsername = async () => {
        setLoading(true);
        try {
            const payload = {
                query: {
                    username,
                    limit: 10
                },
                action: 'SEARCH_FOR_USERNAMES'
            }
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/warpcast/`,
                payload
            );
            console.log('👉🏻 Line 22 : ', data);
            setUsers(data?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (username) {
            getUsersByUsername();
        }
    }, [username]);
    return (
        <div className='card mt-2 bg-dark'>
            {loading ?
                <ChatLoader /> :
                !users?.length ?
                    <div className='card-body text-center h3 pb-0 mb-0 theme-gradient'>No Data Found</div>
                    :
                    <>
                        <UserCard users={users} />
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
const UserCard = ({ users }) => {
    console.log('👉🏻 Line 52 : ', users);

    return (
        <div className='row g-2'>
            {users?.map((user, index) => (

                <div className="col-md-6" key={index}>
                    <div className="card profile-card">
                        <img src={user?.pfp_url} className="card-img-top profile-image" alt="User Image" />
                        <div className="card-body">
                            <h5 className="card-title text-muted px-2">@{user?.username || 'NA'} ({user?.fid})</h5>
                            <p className="card-text fs-5 text-black px-2">Bio: {truncateString(user?.profile?.bio?.text) || 'NA'}</p>
                            <div className='row px-2 pt-2'>
                                <div className='col-6 rounded text-center fs-5'>
                                    <button style={{ background: "#82f5c9" }} class="btn col-12 mt-2" type="button"> followers: {user?.follower_count || 'NA'}</button>
                                </div>
                                <div className='col-6 rounded text-center fs-5' >
                                    <button style={{ background: "#f582d2" }} class="btn col-12 mt-2" type="button">following:  {user?.following_count || 'NA'}</button>
                                </div>
                                <div className='col-12 rounded text-center fs-5'>
                                    <a class="btn btn-primary col-12 mt-2" href={`https://warpcast.com/${user?.username}`} target='blank'>Visit Profile</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            ))
            }

        </div >
    )
}