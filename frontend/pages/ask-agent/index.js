import React from "react";
import PageHead from "../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftPanelDashboard from "@/components/Common/LeftpanelDashboard";
import Modal from "@/components/Common/Modal";
import { nanoid } from "@/lib/utils";
import SearchDataComponent from "@/components/SearchData/SearchData";
import AskAgentComponent from "@/components/AskAgent/AskAgentComponent";
import { useSearchParams } from "next/navigation";

const AskAgentPage = () => {
    const id = nanoid();
    const initialMessages = [
        {
            id: nanoid(),
            role: 'system',
            content: `You are an AI assistant that helps users to get answers. You need to provide best answer to them.`
        }
    ]



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

                        <AskAgentComponent initialMessages={initialMessages}/>
                    </div>
                </Context>
            </main>
        </>
    );
};

export default AskAgentPage;
