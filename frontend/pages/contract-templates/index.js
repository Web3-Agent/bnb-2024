import React from "react";
import PageHead from "../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftPanelDashboard from "@/components/Common/LeftpanelDashboard";
import Dashboard from "@/components/Dashboard/Dashboard";
import Modal from "@/components/Common/Modal";
import { nanoid } from "@/lib/utils";
import ContractTemplates from "@/components/ContractTemplates/ContractTemplates";

const ContractTemplatesPage = () => {


  return (
    <>
      <PageHead title="Dashboard" />

      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="d-none" />
            <PopupMobileMenu />
            <LeftPanelDashboard />
            <Modal />

            <ContractTemplates />
          </div>
        </Context>
      </main>
    </>
  );
};

export default ContractTemplatesPage;
