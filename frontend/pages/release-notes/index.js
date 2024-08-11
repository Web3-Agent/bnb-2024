import React from "react";
import PageHead from "../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import Release from "@/components/Release/Release";

const ReleaseNotesPage = () => {
  return (
    <>
      <PageHead title="Release Notes" />

      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="d-none" />
            <PopupMobileMenu />
            <LeftpanelDashboard />

            <Release />
          </div>
        </Context>
      </main>
    </>
  );
};

export default ReleaseNotesPage;
