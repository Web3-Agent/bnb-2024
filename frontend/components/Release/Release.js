import React from "react";

import NoteData from "../../data/dashboard.json";

const Release = () => {
  return (
    <>
      <div className="rbt-main-content mb--0 mr--0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content">
            <div className="banner-area">
              <div className="settings-area">
                <h3 className="title">Release Notes</h3>
              </div>
              <div className="content-page pb--50">
                <div className="chat-box-list">
                  <div className="content">
                    {NoteData &&
                      NoteData.releaseNote.map((data, index) => (
                        <div
                          className="row changelog_info"
                          id="v120"
                          key={index}
                        >
                          <div className="col-lg-3 changelog_date">
                            <div className="c_date">
                              <h6>{data.date}</h6>
                              <p>{data.text}</p>
                              <p>{data.issue}</p>
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="version_info">
                              <div className="c_version">{data.version}</div>
                              <div className="line bottom_half"></div>
                            </div>
                          </div>
                          <div className="col-lg-7">
                            <div className="changelog_content">
                              {data.content.map((innerData, innerIndex) => (
                                <p key={innerIndex}>
                                  <span
                                    className={`${
                                      innerData.status === "new"
                                        ? innerData.status
                                        : innerData.status
                                    } text-uppercase`}
                                  >
                                    {innerData.status === "new"
                                      ? "ADDED"
                                      : innerData.status}
                                  </span>
                                  {innerData.text}
                                </p>
                              ))}
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

export default Release;
