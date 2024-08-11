import React from 'react';
import PageHead from '../Head';
import Context from '@/context/Context';
import HeaderDashboard from '@/components/Header/HeaderDashboard';
import PopupMobileMenu from '@/components/Header/PopupMobileMenu';
import LeftPanelDashboard from '@/components/Common/LeftpanelDashboard';
import Modal from '@/components/Common/Modal';
import { nanoid } from '@/lib/utils';
import SearchDataComponent from '@/components/SearchData/SearchData';
import ConnectWallet from '@/components/ConnectWallet/ConnectWallet';
import { useAccount } from 'wagmi';
import { Web3Provider } from '@/context/Web3Provider';
import SearchDataMain from '@/components/SearchData/SearchDataMain';
import RightpanelDashboard from '@/components/Common/RightpanelDashboard';
import StaticbarDashboard from '@/components/Common/StaticbarDashboard';

const SearchData = () => {
  return (
    <>
      <PageHead title='Dashboard' />

      <main className='page-wrapper rbt-dashboard-page '>
        <Context>
          <div className='rbt-panel-wrapper'>
            <HeaderDashboard display='d-none' />
            <PopupMobileMenu />
            <LeftPanelDashboard />
            {/* <RightpanelDashboard /> */}

            <Modal />


            {/* {isConnected ? */}
            <SearchDataMain />
            {/* : <ConnectWallet />} */}
          </div>
        </Context>
      </main>
    </>
  );
};

export default SearchData;
