# Sponsors

## Dextools
In our project, we integrated the Dextools API to enhance our platform with real-time and historical data related to cryptocurrency and blockchain activities. Dextools is a widely recognized tool in the DeFi and cryptocurrency space, providing comprehensive analytics, token tracking, and market data that are crucial for various Web3 applications.

### Prompts
![image](https://github.com/Web3-Agent/web3agent-v2/assets/16322269/ae8bc812-d7eb-4d26-8adb-f6f706593117)


### Token List
![image](https://github.com/Web3-Agent/web3agent-v2/assets/16322269/ef53b45e-8c81-483c-bb74-30b60e7b0b6e)

### Token Details
![image](https://github.com/Web3-Agent/web3agent-v2/assets/16322269/5dabc35a-445e-4294-913f-b47118db0a29)


## Chainlink
We have used chain link in a project for adding a functionality for limit order. In the limit order we use changing automation to constantly check if the user’s time period to execute a limit order is active or not and whenever the chain link find an executable transaction it executes it.

### Limit Order using Chainlink Automation

This project includes contracts to deploy a chainlink automated limit order function which triggers a swap whenever user's set price is achieved.

This contract is using both UniswapV3 and UniswapV2 for the swap. 

Using Chainlink automation we have added checkUpkeep and performUpkeep. checkUpkeep contains logic to fetch and compare current price and if it matches any of the order's set price the performUpkeep is triggered. 
We are using forwarder to secure the perform function.


Addresss: 

```
Polygon: 0xC4a88B919E1D9D063feE42b0C798a17e5De3B8F7
Avax   : 0xC4a88B919E1D9D063feE42b0C798a17e5De3B8F7
```

