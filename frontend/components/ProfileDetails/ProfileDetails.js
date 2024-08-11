import React from "react";

import ProfileBody from "./ProfileBody";
import UserNav from "../Common/UserNav";

const ProfileDetails = () => {
  return (
    <>
      <div className="rbt-main-content mr--0 mb--0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content">
            <UserNav title="Profile Details" />

            <div className="content-page pb--50">
              <div className="chat-box-list">
                <ProfileBody />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
