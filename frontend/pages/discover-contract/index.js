
import React from 'react'

import PageHead from "../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import TermsPolicy from "@/components/TermsPolicy/TermsPolicy";
import TokenList from "@/components/TokenList/TokenList";
import DiscoverCon from '@/components/DiscoverCon/DiscoverCon';

export default function DiscoverContract() {
    return (
        <>
            <PageHead title="Token List" />

            <main className="page-wrapper rbt-dashboard-page">
                <Context>
                    <div className="rbt-panel-wrapper">
                        <HeaderDashboard display="d-none" />
                        <PopupMobileMenu />
                        <LeftpanelDashboard />

                        <DiscoverCon />
                    </div>
                </Context>
            </main>
        </>
    )
}
