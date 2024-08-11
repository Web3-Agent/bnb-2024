import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { apiHeader, apiUrl } from '@/api/apiConstant';
import Loading from '../Loading/Loading';
import Link from 'next/link';


// Static mapping of token symbols to logo URLs
const tokenLogos = {
  BTC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  ETH: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  USDT: 'https://seeklogo.com/images/T/tether-usdt-logo-FA55C7F397-seeklogo.com.png',
  USDC: 'https://logo.moralis.io/0x1_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48_e6ec22e3ef954a7f9eda04f294938f4d',
  BNB: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  XRP: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
  ADA: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
  DOGE: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
  MATIC:
    'https://logo.moralis.io/0x1_0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0_89c931b3fcf74fe39db7a195bf8a3aa5',
  SOL: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
};

const TokenList = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${apiUrl()}api/v1/data-api/`,

          {
            action: 'LATEST_TOKEN_LIST',
            provider: 'coinmarketcap',
            query: {
              limit: 10,
            },
          },
          {
            headers: apiHeader(),
          }
        );
        const data = response?.data?.data?.data.map((token) => ({
          tokenName: token.name,
          tokenSymbol: token.symbol,
          tokenLogo:
            tokenLogos[token.symbol] || 'https://via.placeholder.com/32',
          price: token.quote.USD.price,
          '1hChange': token.quote.USD.percent_change_1h,
          '24hChange': token.quote.USD.percent_change_24h,
          '7dChange': token.quote.USD.percent_change_7d,
          aiScore: 'N/A', // Assuming there's no AI score in the API response
          marketCap: `$${(token.quote.USD.market_cap / 1e6).toFixed(2)}M`, // Convert market cap to millions
        }));
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchCoins();
  }, []);

  const handleAskAgent = (tokenName) => {
    const prompt = `Please generate an analysis report in which you analyze the main bullish and bearish indicators for the token ${tokenName} on the ETH network.`;
    const url = `/dashboard?prompt=${encodeURIComponent(prompt)}`;
    router.push(url);
  };

  // const askAgent = (tokenName,aiScore) => {
  //   const prompt1 = `name=${tokenName}`
  //   const url = `/ask-agent?${encodeURIComponent(prompt1)}`;
  //   router.push(url);
  // }

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
        <div
          className='rbt-dashboard-content'
          style={{ width: '100%', maxWidth: '1200px', padding: '10px' }}
        >
          <div className='content-page pb--50'>
            <div className='chat-box-list'>
              <div className='crypto-table'>
                <table style={tableStyles}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyles, textAlign: 'center' }}>
                        Token
                      </th>
                      <th style={thStyles}>Price</th>
                      <th style={thStyles}>Market Cap</th>
                      <th style={thStyles}>% 1h</th>
                      <th style={thStyles}>% 24h</th>
                      <th style={thStyles}>% 7d</th>
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
                          <Link href="/token-detail">
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
                        <td style={thTdStyles} data-label='Price'>
                          ${token.price.toFixed(6)}
                        </td>
                        <td style={thTdStyles} data-label='Market Cap'>
                          {token.marketCap}
                        </td>
                        <td style={thTdStyles} data-label='% 1h'>
                          {token['1hChange']}%
                        </td>
                        <td style={thTdStyles} data-label='% 24h'>
                          {token['24hChange']}%
                        </td>
                        <td style={thTdStyles} data-label='% 7d'>
                          {token['7dChange']}%
                        </td>
                        <td style={thTdStyles} data-label='AI Score'>
                          {token.aiScore}
                        </td>
                        <td style={thTdStyles} data-label='Action'>
                          
                          <div
                            className='btn-default btn-small round'
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleAskAgent(token.tokenName)}
                            // onClick={()=>askAgent(token.tokenName,token.aiScore)}
                          >
                            Ask Agent
                          </div>
                          
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
      `}</style>
    </div>
  );
};

export default TokenList;
