import React from 'react';
import ResourceCard from './ResourceCard'; 
import styles from './PromptList.module.css';

const contracts = [
  {
    type: 'Contracts',
    title: 'Simple ERC20 Token',
    description: 'ERC20 token with the following features: - Premint your total supply. ...',
  },
  {
    type: 'Contracts',
    title: 'Azuki ERC721A NFT Sale',
    description: 'This smart contract is an implementation of the ERC721A...',
  },
  {
    type: 'Contracts',
    title: 'Flash Loan Attacker',
    description: 'This contract is an attacker contract that utilizes flash loans to borrow...',
  },
];

const protocols = [
  {
    type: 'Protocols',
    title: 'Uniswap V4',
    description: 'Uniswap v4 is a new automated market maker protocol that provides extensib...',
  },
  {
    type: 'Protocols',
    title: 'ChainLink',
    description: 'Chainlink expands the capabilities of smart contracts by enabling access to...',
  },
  {
    type: 'Protocols',
    title: 'Opensea Seaport',
    description: 'Seaport is a marketplace protocol for safely and efficiently buying and selli...',
  },
];

const chains = [
  {
    type: 'Chains',
    title: 'Linea',
    description: 'Linea combines the power of zero-knowledge proofs with full Ethereum...',
  },
  {
    type: 'Chains',
    title: 'Base',
    description: 'Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring th...',
  },
  {
    type: 'Chains',
    title: 'Zircut',
    description: 'Zircut is a fully EVM-compatible, zero-knowledge rollup powered by the late...',
  },
];

const PromptList = () => {
  return (
    <div className="rbt-main-content mb--0 mr--0">
      <div className="rbt-daynamic-page-content center-width">
        <div className="rbt-dashboard-content">
          <div className="banner-area">
            <div className="settings-area">
              <h3 className="title">Prompt List</h3>
            </div>
          </div>
          <div className="content-page pb--50">
            <div className={styles.resourcesContainer}>
              <div className={styles.resourcesSection}>
                <h2 style={ { textAlign: "center", fontSize: "25px" } }>
                                <span className="theme-gradient">Contracts</span>

                  
                
                </h2>
                <div className={styles.resourcesGrid}>
                  {contracts.map((contract, index) => (
                    <ResourceCard key={index} title={contract.title} description={contract.description} />
                  ))}
                </div>
              </div>
              <div className={styles.resourcesSection}>
                <h2 style={ { textAlign: "center", fontSize: "25px" } }>
                   <span className="theme-gradient">Protocols</span>
                  </h2>
                <div className={styles.resourcesGrid}>
                  {protocols.map((protocol, index) => (
                    <ResourceCard key={index} title={protocol.title} description={protocol.description} />
                  ))}
                </div>
              </div>
              <div className={styles.resourcesSection}>
                <h2 style={ { textAlign: "center", fontSize: "25px" } }>
                  <span className="theme-gradient">Chains</span>
                  </h2>
                <div className={styles.resourcesGrid}>
                  {chains.map((chain, index) => (
                    <ResourceCard key={index} title={chain.title} description={chain.description} />
                  ))}
                </div>
              </div>
            </div>
            <footer className={styles.AppFooter}>
              <button>Browse All Contracts</button>
              <button>Browse All Protocols</button>
              <button>Browse All Chains</button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptList;
