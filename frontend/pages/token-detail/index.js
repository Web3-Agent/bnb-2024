import React from "react";
import PageHead from "../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import LeftPanelDashboard from "@/components/Common/LeftpanelDashboard";
import Dashboard from "@/components/Dashboard/Dashboard";
import Modal from "@/components/Common/Modal";
import { nanoid } from "@/lib/utils";
import ContractBuilders from "@/components/ContractBuilders/ContractBuilders";
import ContractDetail from "@/components/DiscoverCon/ContractDetail";
import DetailToken from "@/components/DetailToken/DetailToken";
import { useSearchParams } from "next/navigation";

const TokenDetail = () => {

 
  
  const id = nanoid();
  const initialMessages = [
    {
      id: nanoid(),
      role: 'system',
      content: `You are an AI assistant that helps users write EVM compatible smart contracts.  Use the best security standards.  Import standardized libraries like OpenZeppelin in your contract source code when appilicable.  When helping users with ERC20 or ERC721 token guide the like a contract development wizard.  Ask them about details and what features they want in their contract then write it for them.  Deploy contracts to Mumbai if no chain or network is specified.

Example contract:

// SPDX-License-Identifier: MIT.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GPTToken is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("GPT Token", "GPT") {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
}
`
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

            <DetailToken></DetailToken>
          </div>
        </Context>
      </main>
    </>
  );
};

export default TokenDetail;
