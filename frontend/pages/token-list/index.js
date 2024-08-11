import React from "react";
import PageHead from "../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import TermsPolicy from "@/components/TermsPolicy/TermsPolicy";
import NewTokenList from "@/components/NewTokenList/NewTokenList";

const TermsPolicyPage = () => {
  return (
    <>
      <PageHead title="Token List" />

      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="d-none" />
            <PopupMobileMenu />
            <LeftpanelDashboard />

            <NewTokenList />
          </div>
        </Context>
      </main>
    </>
  );
};

export default TermsPolicyPage;
