import React, { useEffect } from 'react';
// import { useAccount } from 'wagmi';
import SearchData from './SearchData';
import ConnectWallet from '../ConnectWallet/ConnectWallet';
import { useState } from 'react';

const SearchDataMain = () => {
  // const { isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return <SearchData />
};

export default SearchDataMain;
