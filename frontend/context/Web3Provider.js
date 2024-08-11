import { WagmiProvider, createConfig, http } from "wagmi";
import '@rainbow-me/rainbowkit/styles.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { mainnet, sepolia, bsc, bscTestnet, arbitrum, arbitrumGoerli, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia } from "wagmi/chains";

export const bscForked = {
  id: 17648,
  name: 'BNB Forked Network',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { http: ['https://rpc.buildbear.io/inquisitive-captainamerica-d031f228'] },
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
}
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
export const GaladrielDevnet = {
  id: 696969,
  name: 'Galadriel Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'GAl',
    symbol: 'GAL',
  },
  rpcUrls: {
    default: {
      http: ['https://devnet.galadriel.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Galadriel Scan',
      url: 'https://explorer.galadriel.com',
      apiUrl: 'https://explorer.galadriel.com',
    },
  }
};

export const bscBuildBear = {
  id: 19323,
  name: 'BSC BB',
  nativeCurrency: {
    decimals: 18,
    name: 'TOKEN',
    symbol: 'TOKEN',
  },
  rpcUrls: {
    default: { http: ['https://rpc.buildbear.io/increasing-deadpool-f1e1efba'] },
  },
  blockExplorers: {
    default: {
      name: 'Scan',
      url: 'https://explorer.buildbear.io/increasing-deadpool-f1e1efba',
      apiUrl: 'https://explorer.buildbear.io/increasing-deadpool-f1e1efba',
    },
  },
}

export const config = getDefaultConfig({
  appName: 'Web3 Agent',
  projectId: 'YOUR_PROJECT_ID',
  chains: [bscBuildBear, mainnet, sepolia, bsc, bscTestnet, arbitrum, arbitrumGoerli, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {



  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#7064E9',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <ToastContainer />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider >
    </WagmiProvider >
  );
};
