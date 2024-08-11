import Image from "next/image";
import React from "react";

import ApplicationData from "../../data/dashboard.json";
import UserNav from "../Common/UserNav";

const Applications = () => {
  return (
    <>
      <div className="rbt-main-content mr--0 mb--0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content">
            <UserNav title="Applications" />
            <div className="content-page pb--50">
              <div className="chat-box-list">
                <div className="single-settings-box sessions-box top-flashlight light-xl leftside overflow-hidden">
                  <div className="section-title d-flex justify-content-between">
                    <h4 className="title">Application</h4>
                    <button className="btn-default btn-small round">
                      Add apps <i className="feather-plus"></i>
                    </button>
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

                    {ApplicationData &&
                      ApplicationData.applications.map((data, index) => (
                        <div className="list-card style-two" key={index}>
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
                                <p className="b4">{data.version}</p>
                              </div>
                            </div>
                            <div className="right-content">
                              <button className="btn-default btn-border round">
                                <i className="feather-trash-2"></i> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
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

export default Applications;
