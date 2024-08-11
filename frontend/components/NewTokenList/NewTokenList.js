import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Loading from '../Loading/Loading';
import Link from 'next/link';

const apiHeader = {
  'accept': 'application/json',
  'X-API-Key': '6003b52789f13f830faf170256386ad6b26dd2f6',
};

const chainOptions = [
  { value: 'ether', label: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024' },
  { value: 'polygon', label: 'Polygon', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=024' },
  { value: 'bsc', label: 'Binance Smart Chain', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=024' },
  { value: 'avalanche', label: 'Avalanche', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=024' },
  { value: 'fantom', label: 'Fantom', icon: 'https://cryptologos.cc/logos/fantom-ftm-logo.png?v=024' },
  // Add other chains as needed
];

const TokenList = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChain, setSelectedChain] = useState(chainOptions[0].value);
  const router = useRouter();

  const fetchAiScore = async (address, chain) => {
    try {
      const response = await axios.get(`https://api.dextools.io/v2/token/${chain}/${address}/score`, {
        headers: apiHeader,
      });
      return response.data.data.dextScore.total || 'N/A';
    } catch (error) {
      console.error(`Error fetching AI score for ${address} on ${chain}:`, error);
      return 'N/A';
    }
  };

  const fetchTokens = async (chain) => {
    try {
      setLoading(true);
      const apiUrl = `https://api.dextools.io/v2/token/${chain}?sort=socialsInfoUpdated&order=asc&from=2023-10-01T00%3A00%3A00.000Z&to=2023-11-01T00%3A00%3A00.000Z`;
      const response = await axios.get(apiUrl, { headers: apiHeader });
      const tokens = response?.data?.data?.tokens;
      console.log("data", response.data)

      const tokensWithAiScores = await Promise.all(
        tokens.map(async (token) => {
          const aiScore = await fetchAiScore(token.address, chain);
          return {
            tokenName: token.name,
            tokenSymbol: token.symbol,
            tokenLogo: token.logo || 'https://via.placeholder.com/32',
            description: token.description.split(' ').slice(0, 6).join(' ') + '...',
            creationTime: token.creationTime,
            marketCap: token.marketCap ? `$${(token.marketCap / 1e6).toFixed(2)}M` : 'N/A',
            aiScore,
            address: token.address,
          };
        })
      );

      setCryptoData(tokensWithAiScores);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens(selectedChain);
  }, [selectedChain]);

  const handleChainChange = (event) => {
    setSelectedChain(event.target.value);
  };

  const handleAskAgent = (tokenName) => {
    const prompt = `Please generate an analysis report in which you analyze the main bullish and bearish indicators for the token ${tokenName} on the ${selectedChain} network.`;
    const url = `/dashboard?prompt=${encodeURIComponent(prompt)}`;
    router.push(url);
  };


  // const handleAddress = (address) => {
  //   const prompt1 = `${address}`;
  //   const url = `/token-detail?address=${encodeURIComponent(prompt1)}`;
  //   router.push(url);
  // };

  const tableStyles = {
    width: '100%',
    margin: '20px auto',
    borderCollapse: 'collapse',
    backgroundColor: '#1a1a1a',
  };

  const thTdStyles = {
    border: '1px solid #333',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#1a1a1a',
    color: '#fff',
  };

  const thStyles = {
    ...thTdStyles,
    backgroundColor: '#333',
  };

  const trEvenStyles = {
    backgroundColor: '#2a2a2a',
  };

  const trHoverStyles = {
    backgroundColor: '#3a3a3a',
  };

  const imgStyles = {
    marginRight: '15px',
    verticalAlign: 'middle',
    marginLeft: '10px',
  };

  const divInlineBlockStyles = {
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  return (
    <div className='rbt-main-content mb--0 mr--0'>
      <div className='rbt-daynamic-page-content center-width'>
        <div className='rbt-dashboard-content' style={{ width: '100%', maxWidth: '1200px', padding: '10px' }}>
          <div className='content-page pb--50'>
            <div className='chat-box-list'>
              <div className='crypto-table'>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="chainSelect">Select Blockchain: </label>
                  <select id="chainSelect" value={selectedChain} onChange={handleChainChange}>
                    {chainOptions.map((chain) => (
                      <option key={chain.value} value={chain.value}>
                        {chain.label}
                      </option>
                    ))}
                  </select>
                </div>
                {loading ? (
                  <Loading />
                ) : (
                  <table style={tableStyles}>
                    <thead>
                      <tr>
                        <th style={{ ...thStyles, textAlign: 'center', width: '25%' }}>
                          Token
                        </th>
                        <th style={{ ...thStyles, width: '15%' }}>Description</th>
                        <th style={thStyles}>Creation Time</th>
                        {/* <th style={thStyles}>Market Cap</th> */}
                        <th style={thStyles}>AI Score</th>
                        <th style={thStyles}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoData.map((token, index) => (
                        <tr
                          key={index}
                          style={index % 2 === 0 ? trEvenStyles : null}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              trHoverStyles.backgroundColor)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              index % 2 === 0
                                ? trEvenStyles.backgroundColor
                                : null)
                          }
                        >
                          
                          
                          <td style={thTdStyles} data-label='Token'>
                          <Link 
                            href={{
                              pathname: "/token-detail",
                              query : {
                                name: `${token.tokenName}`,
                                address: `${token.address}` 
                              }
                            }}
                          >  
                            <img
                              src={token.tokenLogo}
                              alt={`${token.tokenName} logo`}
                              width='32'
                              height='32'
                              style={imgStyles}
                            />
                            
                            <div style={divInlineBlockStyles}>
                              <div>{token.tokenSymbol}</div>
                              <div>{token.tokenName}</div>
                            </div>
                            </Link> 
                          </td>
                          
                          <td style={thTdStyles} data-label='Description'>
                            {token.description}
                          </td>
                          <td style={thTdStyles} data-label='Creation Time'>
                            {new Date(token.creationTime).toLocaleString()}
                          </td>
                          {/* <td style={thTdStyles} data-label='Market Cap'>
                            {token.marketCap}
                          </td> */}
                          <td style={thTdStyles} data-label='AI Score'>
                            {token.aiScore}
                          </td>
                          <td style={thTdStyles} data-label='Action'>
                            <div
                              className='btn-default btn-small'
                              style={{ cursor: 'pointer', textAlign: "center" }}
                              onClick={() => handleAskAgent(token.tokenName)}
                            >
                              Ask Agent
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .rbt-dashboard-content {
            width: 100%;
            padding: 10px;
          }

          .crypto-table table {
            width: 100%;
          }

          .crypto-table th,
          .crypto-table td {
            padding: 8px 4px;
          }

          .crypto-table thead {
            display: none;
          }

          .crypto-table tbody tr {
            display: block;
            margin-bottom: 10px;
            border: 1px solid #333;
            padding: 10px;
            background-color: #1a1a1a;
          }

          .crypto-table tbody tr td {
            display: block;
            text-align: right;
            padding: 8px 0;
            position: relative;
            padding-left: 50%;
          }

          .crypto-table tbody tr td::before {
            content: attr(data-label);
            position: absolute;
            left: 10px;
            width: calc(50% - 20px);
            padding-right: 10px;
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
          }

          .crypto-table tbody tr td img {
            margin: 0;
          }

          .crypto-table tbody tr td div {
            display: flex;
            flex-direction: column;
          }

          .crypto-table tbody tr td .btn-default {
            width: 100%;
            text-align: center;
            margin-top: 10px;
          }
        }

        /* Custom select with images */
        .custom-select {
          position: relative;
          display: inline-block;
        }

        .custom-select select {
          display: none; /*hide original SELECT element*/
        }

        .select-selected {
          background-color: #1a1a1a;
          color: #fff;
          padding: 10px;
          border: 1px solid #333;
          cursor: pointer;
        }

        .select-items {
          position: absolute;
          background-color: #1a1a1a;
          border: 1px solid #333;
          z-index: 99;
          display: none;
        }

        .select-items div {
          color: #fff;
          padding: 10px;
          cursor: pointer;
        }

        .select-items div:hover {
          background-color: #3a3a3a;
        }

        .select-selected::after {
          content: "";
          top: 14px;
          right: 10px;
          position: absolute;
          border: solid white;
          border-width: 0 3px 3px 0;
          padding: 3px;
          transform: rotate(45deg);
        }

        .select-arrow-active::after {
          transform: rotate(-135deg);
        }

        .select-hide {
          display: none;
        }

        .select-show {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default TokenList;
