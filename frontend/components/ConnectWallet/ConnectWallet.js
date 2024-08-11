import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const ConnectWallet = () => {
  return (
    <div className='rbt-main-content mr--0'>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
          flexDirection: 'column',
        }}
      >
        <h2 className='title w-600 '>You need to connect your wallet first!</h2>
        <ConnectButton />
      </div>
    </div>
  );
};

export default ConnectWallet;
