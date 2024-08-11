import React, { useState } from "react";
import Image from "next/image";

import UserNav from "../Common/UserNav";

import ChatExportData from "../../data/dashboard.json";

const ChatExport = () => {
  const [chatExport, setChatExport] = useState(ChatExportData.chatExport);

  const handleChange = (index) => {
    const newChatExport = chatExport.map((item, idx) =>
      idx === index ? { ...item, isChecked: !item.isChecked } : item
    );

    setChatExport(newChatExport);
  };
  return (
    <>
      <div className="rbt-main-content mr--0 mb--0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content">
            <UserNav title="Chat Export" />
            <div className="content-page pb--50">
              <div className="chat-box-list">
                <div className="single-settings-box chatexpo-box top-flashlight light-xl leftside overflow-hidden">
                  <div className="form-check form-switch notification-box-switch">
                    <h4 className="title">Chat export</h4>
                  </div>
                  <div className="rbt-sm-separator mt-0"></div>
                  <div className="rbt-checkbox-grp">
                    {ChatExportData &&
                      chatExport.map((data, index) => (
                        <div
                          className="rbt-checkbox-wrapper style-2"
                          key={index}
                        >
                          <input
                            id={`rbt-checkbox-${index}`}
                            name={`rbt-checkbox-${index}`}
                            type="checkbox"
                            checked={data.isChecked || false}
                            onChange={() => handleChange(index)}
                            value="yes"
                          />
                          <label htmlFor={`rbt-checkbox-${index}`}>
                            <span className="img-section">
                              <Image
                                src={data.img}
                                width={31}
                                height={31}
                                alt="Team"
                              />
                            </span>
                            <span className="content-section">
                              <span className="title">{data.title}</span>
                              <span className="radio-badge">
                                {data.badge} Conversations
                              </span>
                            </span>
                          </label>
                        </div>
                      ))}
                  </div>
                  <div className="form-group mt--40">
                    <a className="btn-default" href="#">
                      Export Chat
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatExport;
