import React from "react";
import Image from "next/image";

import UserNav from "../Common/UserNav";

import SessionData from "../../data/dashboard.json";

const Sessions = () => {
  return (
    <>
      <div className="rbt-main-content mr--0 mb--0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content">
            <UserNav title="Sessoins" />
            <div className="content-page pb--50">
              <div className="chat-box-list">
                <div className="single-settings-box sessions-box top-flashlight light-xl leftside overflow-hidden">
                  <div className="section-title">
                    <h4 className="title mb--0">Your Seasons</h4>
                    <p className="description">
                      Terminate any unauthorized sessions from the roster of
                      devices accessing your account.
                    </p>
                  </div>
                  <div className="rbt-sm-separator mt-0"></div>
                  <div className="list-card-grp">
                    <div className="toolbar d-flex">
                      <div className="icon">
                        <i className="feather-info"></i>
                      </div>
                      <p className="desc">
                        You accessed the system from two distinct devices
                        utilizing separate web browsers...
                      </p>
                    </div>

                    {SessionData &&
                      SessionData.sessions.map((data, index) => (
                        <div className="list-card" key={index}>
                          <div className="inner">
                            <div className="left-content">
                              <div className="img-section">
                                <Image
                                  src={data.img}
                                  width={40}
                                  height={40}
                                  alt="Browser Icon"
                                />
                              </div>
                              <div className="content-section">
                                <h6 className="title">{data.title}</h6>
                                <p className="desc">{data.desc}</p>
                                <p className="date">{data.date}</p>
                              </div>
                            </div>
                            <div className="right-content">
                              <button className="btn-default btn-border">
                                <i className="feather-trash-2"></i> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div className="btn-group mt--20">
                      <a className="btn-default" href="#">
                        <i className="feather-log-out"></i> Sign out All devices
                      </a>
                    </div>
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

export default Sessions;
