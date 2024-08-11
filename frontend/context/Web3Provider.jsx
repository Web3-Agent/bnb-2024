import { WagmiProvider, createConfig, http } from 'wagmi';
import { bsc,polygonZkEvmCardona,polygonZkEvmTestnet,avalancheFuji, opBNBTestnet, zkSyncSepoliaTestnet,scrollSepolia } from 'wagmi/chains';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';


// Network name
// Saturn
// Network URL
// https://saturn-rpc.swanchain.io
// Chain ID
// 2024
// Currency symbol
// sETH
// Block explorer URL
// https://saturn-explorer.swanchain.io
export const Saturn = {
  id: 2024,
  name: 'Swanchain Saturn',
  nativeCurrency: {
    decimals: 18,
    name: 'sETH',
    symbol: 'sETH',
  },
  rpcUrls: {
    default: {
      http: ['https://saturn-rpc.swanchain.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://saturn-explorer.swanchain.io',
      apiUrl: 'https://saturn-explorer.swanchain.io',
    },
  }
};

export const bscForked = {
  id: 17648,
  name: 'BuildBear Inquisitive Captainamerica',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.buildbear.io/inquisitive-captainamerica-d031f228'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://bscscan.com',
      apiUrl: 'https://api.bscscan.com/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 15921452,
    },
  },
};

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [bsc,polygonZkEvmCardona,polygonZkEvmTestnet,avalancheFuji, opBNBTestnet, zkSyncSepoliaTestnet,scrollSepolia,Saturn],
    transports: {
      [opBNBTestnet.id]: http(),
      [bscGreenfield.id]: http(),
      [bsc.id]: http(),
      // RPC URL for each chain
      [sepolia.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: 'Web3 Agent',

    // Optional App Info
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
