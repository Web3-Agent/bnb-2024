import React, { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import sal from 'sal.js';
import { nanoid } from '../../lib/utils';
import BannerArea from './BannerArea';
import Image from 'next/image';
import Form from '@/pages/Form';
import Items from './items';
import user from '../../public/images/team/team-01.jpg';
import { functionSchemas } from '@/lib/functions/schemas';
import { useChatComponentHandler } from '@/context/ChatComponentHandler';
import CodeGenerator from '../CodeGenerator/CodeGenerator';
import { ChatList } from '../Chat/ChatList';
import { MemoizedReactMarkdown } from '../Chat/Markdown';
import { CodeBlock } from '../Chat/CodeBlock';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import ReactMarkdown, { Options } from 'react-markdown';
import loaderGif from '../../public/images/icons/loader-one.gif';
import avatar from '../../public/images/team/avater.png';
import axios from 'axios';
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useWalletClient,
} from 'wagmi';
import { getChainId } from '@wagmi/core'
import { useSendTransaction } from 'wagmi';
import Web3 from 'web3';
import Prompts from './Prompts';
import { FaLaptopCode, FaUserTie } from 'react-icons/fa6';
import { cardData } from './cardData';
import Reaction from '../Common/Reaction';
import HtmlCode from '../CodeGenerator/HtmlCode';
import { apiHeader, apiUrl } from '@/api/apiConstant';
import ConnectWallet from '../ConnectWallet/ConnectWallet';
import ReactionBot from '../Common/ReactionBot';
import { useAppContext } from '@/context/Context';
import Button from '../ui/Button';
import { Wallet, Provider, Contract, utils } from 'zksync-web3';
import { config } from '../../context/Web3Provider'
import SwapComponent from '../Common/SwapComponant';
// import optimism from '@eth-optimism/sdk'
// import ethers from 'ethers'


const DEFAULT_PROMPT_MESSAGES = [
  {
    prompt:
      'Transfer 0.01 CCIP-BnM to MODE TESTNET',
    example:
      'Transfer 0.01 CCIP-BnM to MODE TESTNET',
    category: 'Mode'
  },
  {
    prompt:
      'Swap 1 USDC to ETH with 5% slippage using enso',
    example:
      'Swap 1 USDC to ETH with 5% slippage using enso',
    category: 'Mode'
  },
  {
    prompt: 'swap 0.0001 ETH to USDC on MODE MAINNET network with 5% slippage',
    example: 'swap 0.0001 ETH to USDC on MODE MAINNET network with 5% slippage',
    category: 'Mode'
  },
  {
    prompt:
      'transfer 1 ETH  to OPTIMISM',
    example:
      'transfer 1 ETH  to OPTIMISM',
    category: 'Mode'
  },
  {
    prompt:
      'Send 0.0001 ETH to 0x20613aBe93e4611Cf547b4395E4248c6129c8697',
    example:
      'Send 0.0001 ETH to 0x20613aBe93e4611Cf547b4395E4248c6129c8697',
    category: 'Mode'
  },
  {
    prompt:
      'approve 0.001 ETH to 0x20613aBe93e4611Cf547b4395E4248c6129c8697',
    example:
      'approve 0.001 ETH to 0x20613aBe93e4611Cf547b4395E4248c6129c8697',
    category: 'Mode'
  },
  {
    prompt:
      'wrap 0.000001 ETH on Etherium network',
    example:
      'wrap 0.000001 ETH on Etherium network',
    category: 'Mode'
  },
  {
    prompt:
      'unwrap 0.000001 ETH on Etherium network',
    example:
      'unwrap 0.000001 ETH on Etherium network',
    category: 'Mode'
  },
  //optimism

  {
    prompt:
      'Swap 1 USDC to ETH with 5% slippage using enso',
    example:
      'Swap 1 USDC to ETH with 5% slippage using enso',
    category: 'Optimism'
  },
  {
    prompt: 'swap 0.0001 ETH to USDC on MODE MAINNET network with 5% slippage',
    example: 'swap 0.0001 ETH to USDC on MODE MAINNET network with 5% slippage',
    category: 'Optimism'
  },
  {
    prompt:
      'transfer 1 ETH  to OPTIMISM',
    example:
      'transfer 1 ETH  to OPTIMISM',
    category: 'Optimism'
  },
  {
    prompt:
      'Send 0.0001 ETH to 0x20613aBe93e4611Cf547b4395E4248c6129c8697',
    example:
      'Send 0.0001 ETH to 0x20613aBe93e4611Cf547b4395E4248c6129c8697',
    category: 'Optimism'
  },
  {
    prompt:
      'approve 0.001 ETH to 0x20613aBe93e4611Cf547b4395E4248c6129c8697',
    example:
      'approve 0.001 ETH to 0x20613aBe93e4611Cf547b4395E4248c6129c8697',
    category: 'Optimism'
  },
  {
    prompt:
      'wrap 0.000001 ETH on Etherium network',
    example:
      'wrap 0.000001 ETH on Etherium network',
    category: 'Optimism'
  },
  {
    prompt:
      'unwrap 0.000001 ETH on Etherium network',
    example:
      'unwrap 0.000001 ETH on Etherium network',
    category: 'Optimism'
  },

  //ccpi category
  {
    prompt:
      'Transfer 0.01 CCIP-BnM to MODE TESTNET',
    example:
      'Transfer 0.01 CCIP-BnM to MODE TESTNET',
    category: 'CCIP'
  },
  {
    prompt:
      'Transfer 0.01 CCIP-BnM to BASE MAINNET',
    example:
      'Transfer 0.01 CCIP-BnM to MODE MAINNET',
    category: 'CCIP'
  },

];

const SendTransaction = ({ id, initialMessages }) => {
  const { action, setAction } = useChatComponentHandler();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: provider } = useWalletClient();
  const [showStartMsg, setShowStartMsg] = useState(true);
  // Add state for inputs
  const [isClient, setIsClient] = useState(false);
  const [transactionCallData, setTransactionCallData] = useState(null);
  const [transactionData, setTransactionData] = useState();
  const [apiResponseData, setApiResponseData] = useState()
  const { inputs, setInputs } = useAppContext();
  const [message, setMessage] = useState('');
  const [showCommandPan, setShowCommandPan] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const chainIdT = getChainId(config)
  const [callDataArrayState, setCallDataArrayState] = useState([])
  const [parsedArgsState, setParsedArgsState] = useState({
    fromSymbol: '',
    toSymbol: '',
    network: '',
    tokenAmount: '',  // default value as empty string if parsedArguments is undefined
    fromAmount: '',
    slippage: ''
  });

  const updateParsedArgsState = (newValues) => {
    setParsedArgsState(prevState => ({
      ...prevState,
      ...newValues
    }));
  };
  let chainId;

  if (chainIdT == 19323) {
    console.log("chain id is 56")
    chainId = 56
  }
  else {
    chainId = chainIdT
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const resetToDefault = () => {
    setMessage('');
    setAction((prev) => ({
      ...prev,
      type: '',
      data: {},
    }));
    setMessages([]);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() !== '') {
      handleSendMessage(message);
      console.log(message);
      setMessage('');
    } else {
      alert('Please enter a message.');
    }
  };

  const handleKeyPress = (event) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const getCategoryNames = () => {
    let category =
      DEFAULT_PROMPT_MESSAGES.map(item => item.category).filter(function (v, i, self) {
        return i == self.indexOf(v);
      });
    return ['All'].concat(category)
  }
  useEffect(() => {
    // Scrolls to the bottom of the container when component mounts or updates
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });


  const scrollToTop = () => {
    const container = document.querySelector('#scrollable-container'); // Replace '#scrollable-container' with the ID of your scrollable container
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);



  const sendTransactionFunc = async () => {
    console.log(transactionCallData, 'transactionCallData');

    try {
      const web3 = new Web3(provider);

      const accounts = await web3.eth.requestAccounts();
      const userAddress = accounts[0];

      const gasLimit = 200000;
      const gasPrice = await web3.eth.getGasPrice();

      const transactionData = {
        from: userAddress,
        to: transactionCallData.to,
        value: transactionCallData.value,
        data: transactionCallData.calldata,
        gasLimit: 800000,

      };

      console.log("send transaction function ======>>>>>>>", transactionData);

      // Send the transaction using web3, which will prompt MetaMask
      const signedTx = await web3.eth.sendTransaction(transactionData);

      return signedTx;

    } catch (e) {
      // Handle the case where the transaction fails after user confirmation
      if (e.code === 4001) {
        console.log('User rejected the transaction.');
      } else if (e.code === -32000) {
        console.log('Insufficient funds for gas.');
      } else {
        console.log('An error occurred:', e.message);
      }
    }

  };

  const sendTransactionFuncSwap = async (transactionCallData) => {

    console.log(transactionCallData, 'transactionCallData');
    try {
      const web3 = new Web3(provider);

      const accounts = await web3.eth.requestAccounts();
      const userAddress = accounts[0];

      // const gasLimit = 200000;
      // const gasPrice = await web3.eth.getGasPrice();

      const transactionData = {
        from: userAddress,
        to: transactionCallData.to,
        value: transactionCallData.value,
        data: transactionCallData.calldata,
        gasLimit: 800000,

      };

      console.log("after web3 call ========>>>>>>>.", transactionData);

      const signedTx = await web3.eth.sendTransaction(transactionData);

      return signedTx;
    } catch (e) {
      // Handle the case where the transaction fails after user confirmation
      toast.error('Insufficient funds for gas.');

      if (e.code === 4001) {
        console.log('User rejected the transaction.');
      } else if (e.code === -32000) {
        console.log('Insufficient funds for gas.');
        toast.error('Insufficient funds for gas.');
      } else {
        console.log('An error occurred:', e.message);
      }
    }
  };

  const ccIPTransactionFuncation = async () => {

    console.log("callDataArrayState =======>>>>>>>", callDataArrayState);


    for (let i = 0; i < callDataArrayState.length; i++) {
      console.log("i===>>>>", i, callDataArrayState[i]);

      const tempData = {
        calldata: callDataArrayState[i].calldata,
        to: callDataArrayState[i].to,
        from: callDataArrayState[i].from,
        value: callDataArrayState[i].value,
      };

      console.log("temp data ======>>>>>>", tempData);



      await sendTransactionFuncSwap(tempData);


    }

  };

  //   try {
  //     const web3 = new Web3(provider);


  //     const accounts = await web3.eth.requestAccounts();
  //     const userAddress = accounts[0];



  //     const l1Provider = new ethers.providers.StaticJsonRpcProvider("https://rpc.ankr.com/eth_sepolia")
  //     const l2Provider = new ethers.providers.StaticJsonRpcProvider("https://sepolia.optimism.io")
  //     const l1Wallet = new ethers.Wallet(privateKey, l1Provider)
  //     const l2Wallet = new ethers.Wallet(privateKey, l1Provider)

  //     const messenger = new optimism.CrossChainMessenger({
  //       l1ChainId: 11155111, // 11155111 for Sepolia, 1 for Ethereum
  //       l2ChainId: 11155420, // 11155420 for OP Sepolia, 10 for OP Mainnet
  //       l1SignerOrProvider: l1Wallet,
  //       l2SignerOrProvider: l2Wallet,
  //     })

  //     tx = await messenger.depositETH(ethers.utils.parseEther('0.006942'))
  //     await tx.wait()

  //     // const signedTx = await web3.eth.sendTransaction(transactionData);

  //     return tx;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };



  const functionCallHandler = async (chatMessages, functionCall) => {



    if (functionCall.name === 'CREATE_SMART_CONTRACT') {
      console.log('👉🏻 Line 22 : ', JSON.parse(functionCall.arguments));

      setAction((prev) => ({
        ...prev,
        type: 'CREATE_SMART_CONTRACT',
        data: JSON.parse(functionCall.arguments),
      }));

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'CREATE_SMART_CONTRACT',
            role: 'function',
            content: content,
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'GIVE_ME_GAS_PRICE') {
      setAction((prev) => ({
        ...prev,
        type: 'GIVE_ME_GAS_PRICE',
        data: {},
      }));

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'GIVE_ME_GAS_PRICE',
            role: 'function',
            content: "{ name: 'Nikhil Pankaj', }",
            data: { name: 'Nikhil' },
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'TRANSACTION_DETAILS_BY_TRANSACTION_HASH') {
      setAction((prev) => ({
        ...prev,
        type: 'TRANSACTION_DETAILS_BY_TRANSACTION_HASH',
        data: {},
      }));

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'TRANSACTION_DETAILS_BY_TRANSACTION_HASH',
            role: 'function',
            content: "{ name: 'Nikhil Pankaj', }",
            data: { name: 'Nikhil' },
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'APPROVE_ERC20_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'APPROVE_ERC20_TOKEN',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);
      console.log(
        '🚀 ~ functionCallHandle ~ parsedArguments:',
        parsedArguments
      );


      const apiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/calldata/`,
        {
          action: functionCall.name,
          chainId: chainId,
          tokenSymbol: parsedArguments.tokenSymbol,
          userAddress: address,
          amount: parsedArguments.tokenAmount,
          toAddress: parsedArguments.toAddress
        }
      );
      console.log('calling approve function=======>>>>', apiResponse.data);

      const callDataArray = apiResponse.data.data;

      for (let i = 0; i < callDataArray.length; i++) {
        console.log("i===>>>>", callDataArray[i]);

        const tempData = {
          calldata: callDataArray[i].calldata,
          to: callDataArray[i].to,
          from: callDataArray[i].from,
          value: callDataArray[i].value,
        };

        console.log("temp data ======>>>>>>", tempData);
        setTransactionCallData(tempData);
        handlePostStateUpdate(tempData, parsedArguments);
      }

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'APPROVE_ERC20_TOKEN',
            role: 'function',
            content: "",
            display: "approve_form"
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'SEND_ERC20_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'SEND_ERC20_TOKEN',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);

      if (parsedArguments.tokenSymbol == "ETH" || parsedArguments.tokenSymbol == "BNB") {
        const tempData = {
          calldata: "0x",
          to: parsedArguments.receiverAddress,
          from: address,
          value: parsedArguments.tokenAmount,
        };

        console.log("temp data ======>>>>>>", tempData);
        setTransactionCallData(tempData);
      } else {
        const apiResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/calldata/`,
          {
            action: functionCall.name,
            chainId: chainId,
            userAddress: address,
            amount: parsedArguments.tokenAmount,
            tokenSymbol: parsedArguments.tokenSymbol,
            toAddress: parsedArguments.receiverAddress
          }
        );
        console.log("api response data=====>>>>>>", apiResponse.data);
        const callDataArray = apiResponse.data.data;

        for (let i = 0; i < callDataArray.length; i++) {
          console.log("i===>>>>", callDataArray[i]);

          const tempData = {
            calldata: callDataArray[i].calldata,
            to: callDataArray[i].to,
            from: callDataArray[i].from,
            value: callDataArray[i].value,
          };

          console.log("temp data ======>>>>>>", tempData);

          setTransactionCallData(tempData);
          handlePostStateUpdate(tempData, parsedArguments);
        }
      }

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'SEND_ERC20_TOKEN',
            role: 'function',
            content: "",
            display: "send_form"
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'WRAP_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'WRAP_TOKEN',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);
      console.log("chainId =====>>>", chainId)
      const apiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/calldata/`,
        {
          action: functionCall.name,
          chainId: chainId,
          userAddress: address,
          amount: parsedArguments.tokenAmount,
          tokenSymbol: parsedArguments.tokenSymbol,
        }
      );
      console.log("api response data FOR WARAP =====>>>>>>", apiResponse.data);
      const callDataArray = apiResponse.data.data;

      for (let i = 0; i < callDataArray.length; i++) {
        console.log("i===>>>>", callDataArray[i]);

        const tempData = {
          calldata: callDataArray[i].calldata,
          to: callDataArray[i].to,
          from: callDataArray[i].from,
          value: callDataArray[i].value
        };

        console.log("temp data wrap token======>>>>>>", tempData);
        setTransactionCallData(tempData);
        handlePostStateUpdate(tempData, parsedArguments);

      }

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'WRAP_TOKEN',
            role: 'function',
            content: "",
            display: 'wrap_form'
          },
        ],
        functions: functionSchemas,
      };

      console.log("funcion response =======>>>>>>", functionResponse)
      return functionResponse;
    }
    if (functionCall.name === 'UNWRAP_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'UNWRAP_TOKEN',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log("parsed args=====>>>>>", parsedArguments)

      const apiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/calldata/`,
        {
          action: functionCall.name,
          chainId: chainId,
          userAddress: address,
          amount: parsedArguments.tokenAmount,
          tokenSymbol: parsedArguments.tokenSymbol,
        }
      );
      console.log("api response data=====>>>>>>", apiResponse.data);
      const callDataArray = apiResponse.data.data;

      for (let i = 0; i < callDataArray.length; i++) {
        console.log("i===>>>>", callDataArray[i]);

        const tempData = {
          calldata: callDataArray[i].calldata,
          to: callDataArray[i].to,
          from: callDataArray[i].from,
          value: callDataArray[i].value,
        };

        console.log("temp data unwrap ======>>>>>>", tempData);
        setTransactionCallData(tempData);
        handlePostStateUpdate(tempData, parsedArguments);

      }

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'UNWRAP_TOKEN',
            role: 'function',
            content: "",
            display: "unwrap_form"
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }

    if (functionCall.name === 'SWAP_ERC20_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'SWAP_ERC20_TOKEN',
        data: {},
      }));


      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log("parsed arguements for swap token=====>>>>>>>", parsedArguments)



      const apiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/calldata/`,
        {
          action: functionCall.name,
          userAddress: address,
          chainId: chainId,
          fromTokenSymbol: parsedArguments.fromTokenSymbol,
          toTokenSymbol: parsedArguments.toTokenSymbol,
          amount: parsedArguments.tokenAmount,
          slippage: parsedArguments.slippage,
        }
      );



      console.log("api response data=====>>>>>>", apiResponse.data);
      const callDataArray = apiResponse.data.data;

      for (let i = 0; i < callDataArray.length; i++) {
        console.log("i===>>>>", i, callDataArray[i]);

        const tempData = {
          calldata: callDataArray[i].calldata,
          to: callDataArray[i].to,
          from: callDataArray[i].from,
          value: callDataArray[i].value,
        };

        console.log("temp data ======>>>>>>", tempData);

        setTransactionCallData(tempData);
        // updateParsedArgsState( {parsedArguments} )
        handlePostStateUpdate(tempData, parsedArguments);


        console.log("transaction data state on swap ======>>>>>>", transactionCallData)
        // await sendTransactionFunc();
        setApiResponseData(apiResponse.data)


        setMessages([
          ...chatMessages,
          {
            id: nanoid(),
            name: 'SWAP_METAMASK_OPEN',
            role: 'function',
            content: "",
            display: "swap_form"
          },
        ],)




        // await sendTransactionFuncSwap(tempData);
      }
    }

    if (functionCall.name === "SWAP_METAMASK_OPEN") {

      alert("swap metamask called")
      await sendTransactionFuncSwap(transactionCallData);

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'SWAP_ERC20_TOKEN',
            role: 'function',
            content: JSON.stringify(apiResponseData),
            // display:"none"
          },
        ],
        functions: functionSchemas,
      };

      console.log("swap function ========>>>>>", apiResponseData)
      return functionResponse;
    }


    if (functionCall.name === 'CHAINLINK_CCIP') {
      setAction((prev) => ({
        ...prev,
        type: 'CHAINLINK_CCIP',
        data: {},
      }));


      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log("parsed arguements", parsedArguments)

      const chainRegistry = {
        "ethereum mainnet": "1",
        "optimism mainnet": "10",
        "arbitrum mainnet": "42161",
        "polygon mainnet": "137",
        "avalanche mainnet": "43114",
        "bsc mainnet": "56",
        "base mainnet": "8453",
        "ethereum sepolia": "11155111",
        "optimism sepolia": "11155420",
        "ethereum testnet": "11155111",
        "optimism testnet": "11155420",
        "bsc testnet": "97",
        "arbitrum sepolia": "421614",
        "base sepolia": "84532",
        "arbitrum testnet": "421614",
        "base testnet": "84532",
        "mode sepolia": "919",
        "mode testnet": "919"
      }

      const toChainId = chainRegistry[parsedArguments.toChain]

      console.log(" parsedArguments for to chain ==>>>>>>", parsedArguments)

      console.log({
        action: functionCall.name,
        userAddress: address,
        fromChainId: chainId,
        toChainId: toChainId,
        tokenSymbol: parsedArguments.tokenSymbol,
        amount: parsedArguments.tokenAmount,
      })

      const apiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/calldata/`,
        {
          action: functionCall.name,
          userAddress: address,
          fromChainId: chainId,
          toChainId: toChainId,
          tokenSymbol: parsedArguments.tokenSymbol,
          amount: parsedArguments.tokenAmount,
        }
      );

      console.log("api response data=====>>>>>>", apiResponse.data);
      const callDataArray = apiResponse.data.data;


      setCallDataArrayState(callDataArray)

      setMessages([
        ...chatMessages,
        {
          id: nanoid(),
          name: 'CHAINLINK_SWAP',
          role: 'function',
          content: "",
          display: "chainlink_form"
        },
      ],)

    }




    if (functionCall.name === 'ENSO_SWAP') {
      setAction((prev) => ({
        ...prev,
        type: 'ENSO_SWAP',
        data: {},
      }));


      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log("parsed arguements", parsedArguments)





      const apiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/calldata/`,
        {
          action: functionCall.name,
          userAddress: address,
          chainId: chainId,
          fromTokenSymbol: parsedArguments.fromTokenSymbol,
          toTokenSymbol: parsedArguments.toTokenSymbol,
          amount: parsedArguments.tokenAmount,
          slippage: parsedArguments.slippage,
        }
      );

      console.log("api response data=====>>>>>>", apiResponse.data);
      const callDataArray = apiResponse.data.data;

      // for (let i = 0; i < callDataArray.length; i++) {
      //   console.log("i===>>>>", i, callDataArray[i]);

      //   const tempData = {
      //     calldata: callDataArray[i].calldata,
      //     to: callDataArray[i].to,
      //     from: callDataArray[i].from,
      //     value: callDataArray[i].value,
      //   };

      //   console.log( "temp data ======>>>>>>", tempData );

      //   setTransactionCallData(tempData);
      //         handlePostStateUpdate(tempData, parsedArguments);

      //         // await sendTransactionFuncSwap(tempData)

      //       }
      setCallDataArrayState(callDataArray)

      setMessages([
        ...chatMessages,
        {
          id: nanoid(),
          name: 'ENSO_SWAP',
          role: 'function',
          content: "",
          display: "ensoswap_form"
        },
      ],)
      // const functionResponse = {
      //   messages: [
      //     ...chatMessages,
      //     {
      //       id: nanoid(),
      //       name: 'ENSO_SWAP',
      //       role: 'function',
      //       content: "",
      //       display: "ensoswap_form"
      //     },
      //   ],
      //   functions: functionSchemas,
      // };

      // return functionResponse;
    }
  };



  const handlePostStateUpdate = async (tempData, parsedArguments) => {
    await setParsedArgsState(parsedArguments);
    await setTransactionCallData(tempData);

    // console.log("Updated transaction data state ======>>>>>>", transactionCallData);
  };


  // const handlePostStateUpdate = (tempData, parsedArguments) => {
  //   setParsedArgsState(parsedArguments)
  //   setTransactionCallData(tempData);

  //   // console.log("Updated transaction data state ======>>>>>>", transactionCallData);

  // };

  useEffect(() => {
    if (transactionCallData) {
      console.log("Updated transaction data state in useeffect ======>>>>>>", transactionCallData);
      console.log("Updated parsedArgsState data state in useeffect", parsedArgsState)
    }
  }, [transactionCallData, parsedArgsState]);


  const {
    messages,
    setMessages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
  } = useChat({
    experimental_onFunctionCall: functionCallHandler,
    initialMessages,
    id,
    body: {
      id,
    },
    onResponse(response) {
      if (response.status === 401) {
        console.log(response.statusText);
      }
    },
  });

  const handleSendMessage = async (message) => {
    setShowStartMsg(false);
    console.log("the message =======>>>>>>>>>>", message)

    await append(
      {
        id,
        content: message,
        role: 'user',
      },
      { functions: functionSchemas }
    );

    scrollToBottom();
  };

  const handlePromptClick = (prompt) => {
    setInputs(prompt);
    setShowStartMsg(true); // Hide the start message if a prompt is clicked
  };

  useEffect(() => {
    sal();
  }, []);

  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  };

  const processChildren = (children) => {
    if (Array.isArray(children) && typeof children[0] === 'string') {
      const newChildren = [...children];
      newChildren[0] = newChildren[0].replace('`▍`', '▍');
      return newChildren;
    }
    return children;
  };
  // console.log(transactionCallData, 'transactionCallData');
  return isClient ? (
    isConnected ? (
      <>
        <div className='rbt-main-content mr--0' ref={containerRef} id="scrollable-container">
          <div className='rbt-daynamic-page-content'>
            <div className='rbt-dashboard-content'>
              <div className='content-page'>
                <div className='chat-box-list'>
                  <div className='rainbow-generartor-section rainbow-section-gap'>
                    {showStartMsg && (
                      <div className='start-msg'>
                        <div
                          className='section-title text-center sal-animate'
                          data-sal='slide-up'
                          data-sal-duration='700'
                          data-sal-delay='100'
                        >
                          <h4 className='subtitle'>
                            <span className='theme-gradient'>Web3Agent</span>
                          </h4>
                          <h2 className='title w-600 mb--20'>
                            Send transactions with Web3 Agent
                          </h2>
                          <p className='description b1'>
                            Swap your tokens, bridge them across many chains,
                            and much more.
                          </p>
                          {/* <Prompts
                            data={cardData}
                            onPromptClick={handlePromptClick}
                            setInput={setInputs}
                          /> */}
                        </div>
                      </div>
                    )}
                    <div style={{ overflowX: "auto", }} className='genarator-section'>
                      {messages?.slice(1).map((chat, index) => {
                        return (chat.content != "" && chat?.display != "none") ?

                          <>
                            {chat.role === 'user' ? (
                              <div
                                key={index}
                                className='chat-box author-speech bg-flashlight'
                              >
                                <div className='inner'>
                                  <div className='chat-section'>
                                    <div className='author border border-2 border-success'>
                                      <FaUserTie className='text-success' />
                                    </div>
                                    <div className='chat-content'>
                                      <h6 className='title'>You</h6>
                                      <p className='mb--20'>
                                        {chat?.content}
                                      </p>
                                      <Reaction
                                        copyText={() => {
                                          navigator?.clipboard?.writeText(
                                            chat?.content
                                          );
                                        }}
                                        reGenerate={() => {
                                          handleSendMessage(chat?.content);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div
                                  className='chat-box ai-speech bg-flashlight'
                                  key={index}
                                >
                                  <div className='inner top-flashlight leftside light-xl'>
                                    {/* <div className='chat-section generate-section'>
                                <div className='author'>
                                  <i className='feather-check-circle'></i>
                                </div>
                                <div className='chat-content'>
                                  <h6 className='title color-text-off mb--0'>
                                    Scanning the data...
                                  </h6>
                                </div>
                              </div>
                              <div className='chat-section generate-section'>
                                <div className='author'>
                                  <Image
                                    src={loaderGif}
                                    width={40}
                                    height={40}
                                    alt='Loader Images'
                                  />
                                </div>
                                <div className='chat-content'>
                                  <h6 className='title color-text-off mb--0'>
                                    Generating answers for you…
                                  </h6>
                                </div>
                              </div> */}
                                    <div className='chat-section generate-details-section'>
                                      <div className='author border border-2 border-primary'>
                                        <FaLaptopCode className='text-primary' />
                                      </div>
                                      <div className='chat-content'>
                                        <h6 className='title'>Web3 Agent</h6>
                                        <p className='mb--20'>
                                          {chat.content}
                                        </p>
                                        {/* <HtmlCode /> */}
                                        <ReactionBot
                                          copyText={() => {
                                            navigator?.clipboard?.writeText(
                                              chat?.content
                                            );
                                          }}
                                          sendTransaction={sendTransactionFunc}
                                          txInfo={transactionCallData}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </>

                          :

                          <>
                            {chat.display == "swap_form" &&

                              <div >
                                <SwapComponent
                                  // swap={sendTransactionFuncSwap( transactionCallData )}
                                  toAmount={parsedArgsState.tokenAmount}
                                  toSymbol={parsedArgsState.toTokenSymbol}
                                  fromAmount={parsedArgsState.fromAmount}
                                  fromSymbol={parsedArgsState.fromTokenSymbol}
                                  slippage={parsedArgsState.slippage}

                                />
                                <div style={{ textAlign: "center" }} >

                                  <button style={{ background: "purple", textAlign: "center", marginBottom: "10px" }} className='btn-default btn-small btn-border' onClick={() => sendTransactionFuncSwap(transactionCallData)}>Swap</button>
                                </div>

                              </div>
                            }
                            {chat.display == "chainlink_form" &&

                              <div >

                                <div style={{ textAlign: "center" }} >

                                  <button style={{ background: "purple", textAlign: "center" }} className='btn-default btn-small btn-border' onClick={() => ccIPTransactionFuncation()}>Perform CCIP</button>
                                </div>

                              </div>
                            }
                            {chat.display == "ensoswap_form" &&

                              <div >

                                <div style={{ textAlign: "center" }} >

                                  <button style={{ background: "purple", textAlign: "center" }} className='btn-default btn-small btn-border' onClick={() => ccIPTransactionFuncation()}>Perform Swap with Enso</button>
                                </div>

                              </div>
                            }
                          </>
                      }

                      )}
                      <ul className='genarator-card-group'></ul>
                      <div className='content-page'></div>
                    </div>
                  </div>
                </div>
              </div>


              <div className='rbt-static-bar collapse-width'>
                <div className='new-chat-form'>
                  <div class="offcanvas offcanvas-bottom rounded bg-dark" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" style={{ position: 'relative', }}>
                    <div class="offcanvas-header p-4 border-bottom border-secondary">
                      <h5 class="offcanvas-title" id="offcanvasExampleLabel">Query Commands</h5>
                      <button type="button" class="btn-close bg-light" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                      <div className='border-bottom border-secondary pb-4' style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: 20 }}>
                        {getCategoryNames()?.map((item, index) => (
                          <Button
                            key={index}
                            onClick={() => setSelectedCategory(item)}
                            title={item}
                            // btnClass={"btn p-3 btn-secondry border-gradient color-white my-4 fs-4"}
                            btnClass={`btn btn-outline-white color-white p-2 ${selectedCategory === item ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                            style={{ width: '80px' }} />
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', maxHeight: '400px', overflow: 'auto' }}>
                        {DEFAULT_PROMPT_MESSAGES.map((item, index) => (

                          (selectedCategory === 'All' || selectedCategory === item.category) &&
                          <div
                            onClick={() => setMessage(item.example)}

                            key={index}
                            data-bs-dismiss="offcanvas"

                            className='py-2 text-light cursor-pointer'>
                            <i className='feather-terminal px-2'></i>
                            {item.example}
                          </div>
                        ))
                        }
                      </div>
                    </div>
                  </div>
                </div>








                {/* <Form
                  input={inputs}
                  setInput={setInputs}
                  onSendMessage={handleSendMessage}
                /> */}

                <form
                  className='new-chat-form border-gradient'
                  onSubmit={handleSubmit}
                >
                  <div className='left-icons'>
                    <button
                      class="btn"
                      type="button"
                      // onClick={() => setShowCommandPan(true)}
                      onClick={() => {
                        setShowCommandPan(true);
                        // scrollToTop();

                      }}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasExample"
                      aria-controls="offcanvasExample"
                      style={{
                        cursor: 'pointer',
                        color: "white",
                        fontSize: "17px"
                      }}
                    >
                      <i className='feather-command'></i>
                    </button>
                  </div>
                  <textarea
                    rows='1'
                    placeholder='Send a message...'
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyPress}
                  />
                  <div className='right-icons'>
                    <button
                      type='submit'
                      className='form-icon icon-send'
                      data-tooltip-id='my-tooltip'
                      data-tooltip-content='Send message'
                    >
                      <i className='feather-send'></i>
                    </button>
                    <button
                      type='button'
                      className='form-icon icon-send'
                      data-tooltip-id='my-tooltip'
                      data-tooltip-content='Clear query'
                      onClick={() => resetToDefault()}
                    >
                      <i className='feather-refresh-ccw'></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
      <ConnectWallet />
    )
  ) : null;
};

export default SendTransaction;