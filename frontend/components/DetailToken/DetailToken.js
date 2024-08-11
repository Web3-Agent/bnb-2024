import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Loading from '../Loading/Loading';
import { useSearchParams } from 'next/navigation';


const apiHeader = {
  'accept': 'application/json',
  'X-API-Key': '6003b52789f13f830faf170256386ad6b26dd2f6',
};





const DetailToken = () => {

  const searchParam = useSearchParams();
  const addressParam = searchParam.get('address');

  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const router = useRouter();

  const infostyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#333",
    padding: "10px",
    borderRadius: "10px"
  }

  const progressContainer = {
    width: "100%",
    backgroundColor: "black",
    height: "10px",
    borderRadius: "20px", /* Same as the height to create a half-round effect */
    overflow: "hidden", /* Hide overflow to make it look like a half-rounded progress bar */
  }

  const progressBar = {
    height: "100%",
    backgroundColor: "#007bff", /* Set your desired progress bar color */
  }

  const fetchTokens = async (chain) => {
    try {
      setLoading(true);

      console.log(addressParam);
      // const apiUrl = `https://api.dextools.io/v2/token/${address}?sort=socialsInfoUpdated&order=asc&from=2023-10-01T00%3A00%3A00.000Z&to=2023-11-01T00%3A00%3A00.000Z`;
      const apiUrl = `https://api.dextools.io/v2/token/ether/${addressParam}`;
      const infoUrl = `https://api.dextools.io/v2/token/ether/${addressParam}/info`;
      const scoreUrl = `https://api.dextools.io/v2/token/ether/${addressParam}/score`;

      const infoResponse = await axios.get(infoUrl, { headers: apiHeader });
      console.log("infoData", infoResponse.data.data);
      setInfoData(infoResponse?.data?.data);

      const response = await axios.get(apiUrl, { headers: apiHeader });
      console.log("TokenDetail", response.data.data);
      setTokenData(response?.data?.data);

      const scoreResponse = await axios.get(scoreUrl, { headers: apiHeader });
      console.log("DextScore", scoreResponse.data.data);
      setScoreData(scoreResponse?.data?.data);


      // const tokens = response?.data?.data;

      // const tokensWithAiScores = await Promise.all(
      //   tokens.map(async (token) => {
      //     const aiScore = await fetchAiScore(token.address, chain);
      //     return {
      //       tokenName: token.name,
      //       tokenSymbol: token.symbol,
      //       tokenLogo: token.logo || 'https://via.placeholder.com/32',
      //       description: token.description.split(' ').slice(0, 6).join(' ') + '...',
      //       creationTime: token.creationTime,
      //       marketCap: token.marketCap ? `$${(token.marketCap / 1e6).toFixed(2)}M` : 'N/A',
      //       aiScore,
      //       address: token.address,
      //     };
      //   })
      // );

      // setCryptoData(tokensWithAiScores);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);


  return (
    <div className='rbt-main-content mb--0 mr--0'>
      <div className='rbt-daynamic-page-content center-width'>
        <div className='rbt-dashboard-content' style={{ width: '100%', maxWidth: '1200px', padding: '10px' }}>
          <div className='content-page'>
            <div className='chat-box-list'>

              <div
                className='section-title text-center sal-animate'
                data-sal='slide-up'
                data-sal-duration='700'
                data-sal-delay='100'
              >
                <h4 className='subtitle '>
                  <span className='theme-gradient'>Web3Agent</span>
                </h4>
                <h3 className='title w-600 mb--10'>
                  Unleashing the Power of Web3
                </h3>
                <p className='description b3'>
                  We provide Mastering the Art of generating and deploying{' '}
                  <br />
                  Smart contract using simple prompts with AI.
                </p>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignSelf: "center" }}>

                {scoreData && (
                  <div className='border-gradient p-4' style={{ marginBottom: "1rem" }}>
                    <h5 className='title'>Dext Score: {scoreData.dextScore.total}%</h5>
                    <div className="progress half-round" style={progressContainer} >
                      <div className="progress-bar" role="progressbar" style={{ width: `${scoreData.dextScore.total}%`, borderRadius: '20px 0 0 20px' }} aria-valuenow={scoreData.dextScore.total} aria-valuemin="0" aria-valuemax="100" ></div>
                    </div>
                  </div>
                )}

                <div className='border-gradient p-4' >
                  {infoData && (
                    <div className='d-flex gap-3 flex-wrap'>
                      <div className="border-gradient flex-fill" style={infostyle}>
                        <span>HOLDERS</span>
                        <span style={{ fontWeight: "600" }}>{infoData.holders}</span>
                      </div>
                      <div className="border-gradient flex-fill" style={infostyle}>
                        <span>TOTAL SUPPLY</span>
                        <span style={{ fontWeight: "600" }}>{infoData.totalSupply}</span>
                      </div>
                      <div className="border-gradient flex-fill" style={infostyle}>
                        <span>FDV</span>
                        <span style={{ fontWeight: "600" }}>{infoData.fdv}</span>
                      </div>
                      <div className="border-gradient flex-fill" style={infostyle}>
                        <span>MARKET CAP</span>
                        <span style={{ fontWeight: "600" }}>{infoData.mcap}</span>
                      </div>
                      <div className="border-gradient flex-fill" style={infostyle}>
                        <span>TRANSACTION</span>
                        <span style={{ fontWeight: "600" }}>{infoData.transactions}</span>
                      </div>
                    </div>
                  )}

                </div>

                <div className='border-gradient p-4' >
                  {tokenData ? (
                    <div style={{ display: "flex", gap: "2rem" }}>
                      <div>
                        <img src={tokenData.logo} alt='image' style={{ minHeight: "150px", minWidth: "150px", borderRadius: "5px", position: "relative" }}></img>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h5 style={{ marginBottom: "5px" }}>{tokenData.name}</h5>
                        <p style={{ marginBottom: "10px" }}>{tokenData.symbol}</p>
                        <p style={{ marginBottom: "10px", marginTop: "10px" }}>{tokenData.description}</p>
                      </div>
                    </div>

                  ) : (
                    loading ? <Loading /> : <p>No data available</p>
                  )}

                </div>
                
              </div>
              <p style={{float:"right",marginTop:"10px", fontWeight:"600"}}>Powerd by DEXTools API</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DetailToken;
