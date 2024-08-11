import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/Context";
import { ethers } from 'ethers';
import axios from 'axios';
import logo from "../../public/images/logo/logo.png";
import logoDark from "../../public/images/logo/logo-dark.png";
import avatar from "../../public/images/team/team-01.jpg";

import Nav from "./Nav";
import GridMenu from "./GridMenu";

import ToolsData from "../../data/header.json";
import UserMenu from "./UserMenu";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { config } from '../../context/Web3Provider'


const HeaderDashboard = ({ display }) => {
  const {
    mobile,
    setMobile,
    rightBar,
    setRightBar,
    activeMobileMenu,
    setActiveMobileMenu,
  } = useAppContext();

  const { address, isConnected, status } = useAccount();
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [error, setError] = useState('');
  const [connectState, setConnectState] = useState(false)

  useEffect(() => {

    // console.log("authToken from local storage===>>>>>>>>>",localStorage.getItem('authToken'))
    // console.log( "status    =>>>>>", status )
    // console.log( "is address=>>>>>", address )
    // const Token = localStorage.getItem('authToken')


    if (status == "connected" && !connectState) {
      console.log("===========+++++ connected")
      handleWalletConnect();
      setConnectState(true)
    } else if (status == "disconnected" && connectState) {
      console.log("=============== >>>>>>>>> disconnected")
      console.log('Wallet not connected');
      localStorage.clear();
      console.log('Auth token removed from local storage');
      setConnectState(false)
    }


  }, [status]);

  // useEffect(() => {
  //   account
  // }, [])


  const fetchNonce = async (walletAddress) => {
    try {
      console.log(`Fetching nonce for address: ${walletAddress}`);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/user/user-nonce?walletAddress=${walletAddress}`);
      const data = response.data.data;
      console.log('Nonce fetched:', data.nonce);
      return data.nonce;
    } catch (err) {
      setError('Failed to fetch nonce');
      console.error(err);
      return null;
    }
  };

  const signMessage = async (msg) => {
    try {
      if (!window.ethereum) throw new Error('No crypto wallet found');
      console.log('Requesting accounts');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log('Signing message:', msg);
      const signature = await signer.signMessage(msg);
      console.log("signature generated :", signature)
      setSignedMessage(signature);
      return signature;
    } catch (err) {
      setError(err.message);
      console.error('Error signing message:', err);
      return null;
    }
  };

  const fetchAuthToken = async (walletAddress, signature) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/user/token`,
        {
          walletAddress,
          signature,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const authToken = data?.data?.token;
      localStorage.setItem('authToken', authToken);
      console.log('Auth token stored:', authToken);
    } catch (err) {
      setError('Failed to fetch auth token');
      console.error(err);
    }
  };

  const handleWalletConnect = async () => {
    const existingToken = localStorage.getItem('authToken');

    if (existingToken) {
      console.log('Existing token found, skipping signing process.', existingToken);
    }
    else {
      if (address) {
        console.log('Fetching nonce for signing');
        const nonce = await fetchNonce(address);

        if (nonce) {
          setMessage(nonce);
          const signature = await signMessage(nonce);
          if (signature) {
            console.log("signature while handlewalletconnect :", signature)
            await fetchAuthToken(address, signature);
          }
        } else {
          console.log('Failed to fetch nonce or nonce is null');
        }


      }
    }

  };



  return (
    <>
      <header className="rbt-dashboard-header rainbow-header header-default header-left-align rbt-fluid-header">
        <div className="container-fluid position-relative">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-6 col-7">
              <div className="header-left d-flex">
                <div className="expand-btn-grp">
                  <button
                    className={`bg-solid-primary popup-dashboardleft-btn ${!mobile ? "collapsed" : ""
                      }`}
                    onClick={() => setMobile(!mobile)}
                  >
                    <i className="feather-sidebar left"></i>
                  </button>
                </div>
                <div className="logo">
                  <Link href="/">
                    <Image
                      className="logo-light"
                      src={logo}
                      width={160}
                      height={43}
                      alt="Corporate Logo"
                    />

                    <Image
                      className="logo-dark"
                      src={logoDark}
                      width={201}
                      height={35}
                      alt="Corporate Logo"
                    />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-10 col-md-6 col-4">
              <div className="header-right">
                <nav className="mainmenu-nav d-none d-lg-block text-center">
                  {/* <Nav /> my change */}
                </nav>

                <div className="header-btn d-none d-md-block">
                  <ConnectButton></ConnectButton>

                </div>

                <div className="mobile-menu-bar mr--10 ml--10 d-block d-lg-none">
                  <div className="hamberger">
                    <button
                      className="hamberger-button"
                      onClick={() => setActiveMobileMenu(!activeMobileMenu)}
                    >
                      <i className="feather-menu"></i>
                    </button>
                  </div>
                </div>

                <div className={`expand-btn-grp ${display}`}>
                  <button
                    className={`bg-solid-primary popup-dashboardright-btn ${!rightBar ? "collapsed" : ""
                      }`}
                    onClick={() => setRightBar(!rightBar)}
                  >
                    <i className="feather-sidebar right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderDashboard;