import React from "react";
import PageHead from "../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import Notification from "@/components/Notification/Notification";

const NotificationPage = () => {
  return (
    <>
      <PageHead title="Notification" />

      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="d-none" />
            <PopupMobileMenu />
            <LeftpanelDashboard />

            <Notification />
          </div>
        </Context>
      </main>
    </>
  );
};

export default NotificationPage;
