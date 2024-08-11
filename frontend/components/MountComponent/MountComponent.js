import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useChatComponentHandler } from '@/context/ChatComponentHandler';
import { TokenScoreComponent } from './TokenScoreComponent';
import { BlockchainListComponent } from './BlockchainListComponent';
import { PoolLiquidityScore } from './PoolLiquidityScore';
import { TopGainerTokens } from './TopGainerTokens';
import { TopLoserTokens } from './TopLoserTokens';
import { GasComponent } from './GasComponent';
import { TransactionComponent } from './TransactionComponent';
import { TopTokenListComponent } from './TopTokenListComponent';
import { BlockDetailsComponent } from './BlockDetailsComponent';
import DexInformation from './DexInformation';
import TransactionCount from './blockscout/TransactionCount';
import MarketCap from './blockscout/MarketCap';
import QuickStats from './blockscout/QuickStats';
import UsersByUsername from './UsersByUsername';
import UserByFID from './UserByFID';
import FollowersByFID from './FollowersByFID';
import StorageAllocation from './StorageAllocation';
import StorageUsage from './StorageUsage';
import SymbolInformation from './blockscout/SymbolInformation';
import VerifiedSmartContractStats from './blockscout/VerifiedSmartContractStats';

export default function MountComponent({ data }) {
  // const { action, setAction } = useChatComponentHandler();

  const { name, data: componentData } = data
  const renderActionComponent = () => {
    switch (name) {
      case 'GIVE_ME_GAS_PRICE':
        return <GasComponent data={componentData} />;
      case 'TRANSACTION_DETAILS_BY_TRANSACTION_HASH':
        return <TransactionComponent data={componentData} />;
      case 'GIVE_ME_BLOCK_DETAILS_BY_BLOCK_NUMBER':
        return <BlockDetailsComponent data={componentData} />;
      case 'GIVE_ME_TOP_TOKEN_LIST':
        return <TopTokenListComponent data={componentData} />;
      case 'FETCH_TOKEN_SCORE_BY_TOKEN_ADDRESS_AND_NETWORK':
        return <TokenScoreComponent data={componentData} />;
      case 'FETCH_BLOCKCHAIN_LIST':
        return <BlockchainListComponent data={componentData} />;
      case 'FETCH_POOL_LIQUIDITY_SCORE':
        return <PoolLiquidityScore data={componentData} />;
      case 'FETCH_TOP_GAINER_TOKENS':
        return <TopGainerTokens data={componentData} />;
      case 'FETCH_TOP_LOSER_TOKENS':
        return <TopLoserTokens data={componentData} />;
      case 'FETCH_DEX_INFORMATION':
        return <DexInformation data={componentData} />;
      case 'BLOCKSCOUT_TRANSACTION_INFORMATION':
        return <TransactionCount data={componentData} />;
      case 'BLOCKSCOUT_MARKET_CAP_INFORMATION':
        return <MarketCap data={componentData} />;
      case 'BLOCKSCOUT_STATS':
        return <QuickStats data={componentData} />;
      case 'FETCH_USERS_DETAILS_BY_GIVEN_USERNAME':
        return <UsersByUsername data={componentData} />;
      case 'FETCH_USER_DETAILS_BY_GIVEN_FID':
        return <UserByFID data={componentData} />;
      case 'FOLLOWERS_BY_FID':
        return <FollowersByFID data={componentData} />;
      case 'FETCH_USER_STORAGE_ALLOCATION_BY_GIVEN_USERNAME':
        return <StorageAllocation data={componentData} />;
      case 'FETCH_USER_STORAGE_USAGE_BY_GIVEN_USERNAME':
        return <StorageUsage data={componentData} />;
      case 'FETCH_SYMBOL_INFORMATION':
        return <SymbolInformation data={componentData} />;
      case 'FETCH_VERIFIED_SMART_CONTRACTS_COUNTERS':
        return <VerifiedSmartContractStats data={componentData} />;
      default:
        return '';
    }
  };
  return <>{renderActionComponent()}</>;
}
