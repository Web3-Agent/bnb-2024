

import React, { useState } from "react";
import { useAppContext } from "@/context/Context";

const ACTION_LIST = [{
    action: 'DELETE_CHAT',
    text: 'Delete Chat',
    icon: 'trash-2'
}]
const RightPanel = ({ data, chatAction }) => {
    const { shouldCollapseRightbar } = useAppContext();
    const [sectionStates, setSectionStates] = useState({
        previous: true,
        yesterday: true,
        older: true,
    });

    const toggleSection = (section) => {
        setSectionStates((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const truncateString = str => str.length > 24 ? str.slice(0, 32) + '...' : str;
    const getMessage = (chat) => {
        const content = chat?.messages?.length ? chat?.messages[0]['content'] : ''
        return truncateString(content);
    }
    return (
        <>
            <div
                className={`rbt-right-side-panel popup-dashboardright-section ${shouldCollapseRightbar ? "collapsed" : ""
                    }`}
            >
                <div className="right-side-top">
                    <a
                        className="btn-default bg-solid-primary"
                        onClick={() => chatAction({}, 'RESET')}
                    >
                        <span className="icon">
                            <i className="feather-plus-circle"></i>
                        </span>
                        <span>New Chat</span>
                    </a>
                </div>
                <div className="right-side-bottom">
                    {/* <div className="small-search search-section mb--20">
                        <input type="search" placeholder="Search Here..." />
                        <i className="feather-search"></i>
                    </div> */}

                    <div className="chat-history-section">
                        {/* <h6 className="title">Today</h6> */}
                        <ul className="chat-history-list">
                            {
                                (data || []).map((chat, index) => (

                                    <li
                                        className={`history-box my-2 ${'item.isActive' ? "active" : ""}`}
                                        key={index}

                                    >
                                        <span onClick={() => chatAction(chat, 'SELECT')}>
                                            {getMessage(chat)}
                                        </span>
                                        <div className="dropdown history-box-dropdown">
                                            <button
                                                type="button"
                                                className="more-info-icon dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <i className="feather-more-horizontal"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                {ACTION_LIST.map((innerItem, innerIndex) => (
                                                    <li key={innerIndex} onClick={() => { chatAction(chat, 'DELETE') }}>
                                                        <a className="dropdown-item">
                                                            <i className={`feather-${innerItem.icon}`}></i>{" "}
                                                            {innerItem.text}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RightPanel;
